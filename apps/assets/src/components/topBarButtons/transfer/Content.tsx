// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:ENCL-1.0(https://github.com/evmos/apps/blob/main/LICENSE)

import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
} from "react";
import {
  ErrorMessage,
  IconContainer,
  Label,
  PrimaryButton,
  Subtitle,
  Title,
  InfoPanel,
} from "ui-helpers";
import { useTranslation } from "next-i18next";
import { Prefix, TokenMinDenom } from "evmos-wallet/src/registry-actions/types";
import { AssetSelector } from "../parts/AssetSelector";
import { useAccount } from "wagmi";
import {
  StoreType,
  WalletConnection,
  connectWith,
  getActiveProviderKey,
  getGlobalKeplrProvider,
  getPrefix,
  getPrefixes,
  getToken,
  isValidCosmosAddress,
  isValidHexAddress,
  useAccountExists,
  useFee,
  useTokenBalance,
  useTransfer,
} from "evmos-wallet";
import { AccountSelector } from "../parts/AccountSelector";
import { useModal, useModalState } from "../hooks/useModal";
import { TransferSummary } from "../parts/TransferSummary";
import { SendIcon, WizardIcon } from "icons";
import { z } from "zod";
import { chains } from "@evmos-apps/registry";
import { E } from "helpers";
import { useWalletAccountByPrefix } from "../hooks/useAccountByPrefix";
import { getChainByAddress } from "evmos-wallet/src/registry-actions/get-chain-by-account";

import { ICONS_TYPES } from "constants-helper";
import { CopilotButton, StepsContext } from "copilot";
import dynamic from "next/dynamic";
import { connectKeplr, installKeplr, reloadPage } from "./utils";
import { useDispatch, useSelector } from "react-redux";
const Copilot = dynamic(() => import("copilot").then((mod) => mod.Copilot));
import {
  ChainPrefixSchema,
  MinDenomSchema,
} from "evmos-wallet/src/registry-actions/utils";

const sortedChains = Object.values(chains)
  .map(({ prefix }) => prefix)
  .sort((a, b) => {
    if (a === "evmos") return -1;
    if (b === "evmos") return 1;

    return a > b ? 1 : -1;
  });

const TransferModalSchema = z.object({
  receiver: z.string().transform((v) => {
    if (isValidHexAddress(v) || isValidCosmosAddress(v, [...getPrefixes()])) {
      return v;
    }
    return undefined;
  }),
  networkPrefix: ChainPrefixSchema,
  tokenSourcePrefix: ChainPrefixSchema,
  denom: MinDenomSchema,
  amount: z.coerce.bigint().default(0n),
});

export const Content = () => {
  const { t } = useTranslation();

  const {
    state: { receiver, tokenSourcePrefix, denom, networkPrefix, amount },
    setState,
  } = useModalState("transfer", TransferModalSchema, {
    networkPrefix: "evmos",
    tokenSourcePrefix: "evmos",
    denom: "aevmos",
    amount: 0n,
  });

  const { connector, isDisconnected } = useAccount();
  const wallet = useSelector((state: StoreType) => state.wallet.value);
  const dispatch = useDispatch();
  const feeChain = chains[networkPrefix];
  const feeToken = getToken(feeChain.prefix, feeChain.feeToken);
  const {
    data,
    error: walletRequestError,
    refetch,
  } = useWalletAccountByPrefix(networkPrefix);

  const sender = data?.bech32Address;
  const token = getToken(tokenSourcePrefix, denom);
  const senderChain = sender ? getChainByAddress(sender) : chains["evmos"];
  const tokenChain = chains[token.sourcePrefix];

  const { data: accountExists } = useAccountExists(sender);

  const { fee, error: feeError } = useFee({
    sender,
    receiverChainPrefix: receiver ? getPrefix(receiver) : "evmos",
    token: token && {
      denom: token.minCoinDenom,
      sourcePrefix: tokenSourcePrefix,
    },
  });

  const {
    transfer,
    isReady: isReadyToTransfer,
    isLoading: isTransferring,
    data: transferData,
  } = useTransfer({
    sender,
    receiver,
    token: {
      amount: amount,
      denom: denom,
      sourcePrefix: tokenSourcePrefix,
    },
    fee: fee
      ? {
          token: fee.token,
          gasLimit: fee.gas,
        }
      : undefined,
  });
  const { balance } = useTokenBalance(sender, token);

  const { balance: feeTokenbalance } = useTokenBalance(sender, feeToken);

  const destinationNetworkOptions = useMemo((): Prefix[] => {
    // If asset is being held on an EVMOS ACCOUNT
    if (senderChain.prefix === "evmos") {
      // if it's an EVMOS NATIVE TOKEN it can go anywhere
      if (tokenChain.prefix === "evmos") return sortedChains;
      // if it's NOT native to Evmos,than it can go to:
      // - other evmos accounts
      // - its native network
      return ["evmos", tokenChain.prefix];
    }

    // if it's held somewhere else, it can only go to evmos
    return ["evmos"];
  }, [senderChain, tokenChain]);

  const activeProviderKey = getActiveProviderKey();

  const disabledDestinationNetworkOptions = useMemo((): Prefix[] => {
    // If asset is being held on an EVMOS ACCOUNT and the user is using MetaMask
    if (senderChain.prefix === "evmos" && activeProviderKey === "metaMask") {
      // disable all chains expect evmos
      if (tokenChain.prefix === "evmos") {
        return sortedChains.filter((chain) => chain !== "evmos");
      }
      // disable native network
      return [tokenChain.prefix];
    }

    // all enabled.
    return [];
  }, [senderChain, tokenChain, activeProviderKey]);

  /**
   * Centralizing errors
   * We could consider moving this out of the component if it's starts to grow too much
   */
  const errors = useMemo(() => {
    const errors = new Set<
      | "accountDoesntExist"
      | "insufficientBalance"
      | "insufficientBalanceForFee"
      | "userRejectedEnablingNetwork"
      | "networkNotSupportedByConnectedWallet"
    >();

    /**
     * Account doesn't exist
     */
    if (accountExists === false) {
      errors.add("accountDoesntExist");
    }

    /**
     * Balance checks
     */
    const isFeeTokenAndSelectedTokenEqual = feeToken === token;

    if (
      accountExists === false ||
      // Checks if the balance is 0 (undefined means balance might be loading so it's not an error)
      balance?.value === 0n ||
      // Checks if the balance is enough to pay for transfer and fee
      (balance &&
        fee &&
        isFeeTokenAndSelectedTokenEqual &&
        fee.token.amount + amount > balance.value) ||
      // check if balance is enough without considering fee (when fee is paid in a different token)
      (balance && amount > balance.value)
    ) {
      errors.add("insufficientBalance");
    }

    /**
     * Balance check exclusive for fee token
     * Note: The simulation will fail if the user doesn't have enough balance to pay the fee
     * so we will not even know how much the fee would be to begin with
     *
     * so we only check if the balance is 0
     */
    if (feeTokenbalance?.value === 0n) {
      errors.add("insufficientBalanceForFee");
    }
    /**
     * Wallet checks
     */
    if (E.match.byPattern(walletRequestError, /USER_REJECTED_REQUEST/)) {
      errors.add("userRejectedEnablingNetwork");
    }

    if (
      E.match.byPattern(walletRequestError, /NETWORK_NOT_SUPPORTED_BY_WALLET/)
    ) {
      errors.add("networkNotSupportedByConnectedWallet");
    }

    return errors;
  }, [
    balance,
    fee,
    feeError,
    walletRequestError,
    feeTokenbalance,
    accountExists,
    token,
  ]);

  const { setShowModal } = useContext(StepsContext);
  const { setShow } = useModal("transfer");

  const topUpEvmos = () => {
    return (
      errors.has("insufficientBalanceForFee") ||
      errors.has("insufficientBalance")
      // TODO: there was a changed but I'm not sure what value should we use here now
      // && token.chainPrefix === "evmos"
    );
  };

  const handleSendAction = () => {
    if (topUpEvmos()) {
      // TODO: it's also closing the current modal.
      // await setShow(false);
      setShowModal(true);

      // TODO: close send modal
      return;
    }

    // TODO:
    // if (uiexternal) {
    // transfer.bridge.button.text
    // redirect to axelar
    // close send modal
    // }

    transfer();
    return;
  };

  const sendButtonText = () => {
    if (topUpEvmos()) {
      return t("transfer.top.up.button.text");
    }

    // TODO:
    // if (uiexternal) {
    //   return t("transfer.bridge.button.text")
    // }
    return t("transfer.send.button.text");
  };

  useEffect(() => {
    installKeplr();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && reloadPage()) {
        installKeplr();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <section className="space-y-3 w-full">
      <Title
        variant="modal-black"
        icon={<SendIcon className="text-pink-300" />}
      >
        {t("transfer.title")}
      </Title>

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <section>
          <Subtitle variant="modal-black">
            {t("transfer.section.asset")}
          </Subtitle>
          <AssetSelector
            value={{
              networkPrefix,
              tokenSourcePrefix,
              denom,
              amount,
            }}
            address={sender}
            fee={fee?.token}
            onChange={(token) => {
              setState((prev) => ({
                ...prev,
                ...token,
              }));
            }}
          />

          {/* TODO: Some error messages. This is not in the specs, so we need to check with Mian how to display those */}
          {errors.has("userRejectedEnablingNetwork") && (
            <InfoPanel icon={<WizardIcon className="shrink-0" />}>
              <div>
                <p className="pb-4">
                  {t("error.user.rejected.network.title")}
                  <span className="text-pink-300">
                    {chains[networkPrefix].name}
                    {t("error.user.rejected.network.title2")}
                  </span>
                  {t("error.user.rejected.network.title3")}
                </p>
                <p className="pb-8">
                  {t("error.user.rejected.network.authorize.request")}
                  <span className="text-pink-300">
                    {t("error.user.rejected.network.authorize.request2")}
                  </span>
                  {t("error.user.rejected.network.authorize.request3")}
                  <span className="text-pink-300">
                    {t("error.user.rejected.network.authorize.request4")}
                  </span>
                </p>
                <PrimaryButton
                  className="font-normal w-full"
                  onClick={() => refetch()}
                >
                  {t("button.authorize.request.button.text")}
                </PrimaryButton>
              </div>
            </InfoPanel>
          )}
          {errors.has("networkNotSupportedByConnectedWallet") && (
            <InfoPanel icon={<IconContainer type={ICONS_TYPES.METAMASK} />}>
              <div>
                <p className="pb-4">
                  {t("error.network.not.support.by.wallet.connect.with.keplr")}
                  <span className="text-pink-300">
                    {t(
                      "error.network.not.support.by.wallet.connect.with.keplr2"
                    )}
                  </span>
                </p>
                <p className="pb-8">
                  {t("error.network.not.support.by.wallet.connect.with.keplr3")}
                  <span className="text-pink-300">
                    {t(
                      "error.network.not.support.by.wallet.connect.with.keplr4"
                    )}
                  </span>
                  {t("error.network.not.support.by.wallet.connect.with.keplr5")}
                  <span className="text-pink-300">
                    {t(
                      "error.network.not.support.by.wallet.connect.with.keplr6"
                    )}
                  </span>
                </p>
                <PrimaryButton
                  variant={
                    getGlobalKeplrProvider() === null
                      ? "outline-primary"
                      : "primary"
                  }
                  className="font-normal w-full"
                  // TODO: If the user rejects the connection, it's connecting with MetaMask. Check why.
                  onClick={async () => {
                    if (getGlobalKeplrProvider() === null) {
                      connectKeplr();
                      return;
                    }
                    const [err] = await E.try(() => connectWith("keplr"));
                    // TODO: handle error when user rejects the connection
                    if (err) return false;
                  }}
                >
                  {getGlobalKeplrProvider() === null
                    ? t("button.install.keplr")
                    : t("button.connect.with.keplr")}
                </PrimaryButton>
              </div>
            </InfoPanel>
          )}

          <Subtitle variant="modal-black">{t("transfer.section.to")}</Subtitle>
          <AccountSelector
            value={receiver}
            onChange={(receiver) => setState((prev) => ({ ...prev, receiver }))}
            networkOptions={destinationNetworkOptions}
            disabledNetworkOptions={disabledDestinationNetworkOptions}
          />

          {sender && receiver && (
            <div className="space-y-3">
              <Label>{t("transfer.section.summary.title")}</Label>
              <TransferSummary
                sender={sender}
                receiver={receiver}
                token={{
                  amount,
                  denom,
                  sourcePrefix: tokenSourcePrefix,
                }}
                disabled={errors.size > 0 || !isReadyToTransfer}
              />
            </div>
          )}
          {/* TODO: this should appear when we add the opacity to the transfer summary because the user doesn't have enough evmos to pay the fee */}
          {errors.has("insufficientBalance") && (
            <ErrorMessage className="justify-center pl-0">
              {t("message.insufficient.balance")}
              {balance?.formattedLong ?? "0"} {token.denom}
            </ErrorMessage>
          )}
          {errors.has("insufficientBalanceForFee") && feeTokenbalance && (
            <ErrorMessage className="justify-center pl-0">
              {/* TODO: the message might be different if the insufficient token is the fee token? */}
              {t("message.insufficient.balance")}
              {feeTokenbalance.formattedLong} {feeTokenbalance.denom}
            </ErrorMessage>
          )}

          {/* TODO: show it correctly */}
          {/* <ErrorMessage className="justify-center pl-0" variant="info">
            {t("error.send.axelar.assets.text")}{" "}
            <span className="text-red-300">
              {t("error.send.axelar.assets.text2")}
            </span>{" "}
            {t("error.send.axelar.assets.text3")}
          </ErrorMessage> */}
          {isDisconnected && (
            <WalletConnection
              copilotModal={({
                beforeStartHook,
              }: {
                beforeStartHook: Dispatch<SetStateAction<boolean>>;
              }) => <CopilotButton beforeStartHook={beforeStartHook} />}
              dispatch={dispatch}
              walletExtension={wallet}
            />
          )}
          {!isDisconnected && (
            <PrimaryButton
              variant={topUpEvmos() ? "outline-primary" : "primary"}
              onClick={handleSendAction}
              className="w-full text-lg rounded-md capitalize mt-5"
              disabled={errors.size > 0 || !isReadyToTransfer || isTransferring}
            >
              {sendButtonText()}
            </PrimaryButton>
          )}

          {isTransferring && (
            <p>Please, check your wallet to sign your transaction</p>
          )}
        </section>
      </form>
      <Copilot />
    </section>
  );
};
