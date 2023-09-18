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
import { isString, raise } from "helpers";
import { Trans, useTranslation } from "next-i18next";
import { Prefix } from "evmos-wallet/src/registry-actions/types";
import { AssetSelector } from "../shared/AssetSelector";
import { useAccount } from "wagmi";
import {
  StoreType,
  WalletConnection,
  connectWith,
  getActiveProviderKey,
  getGlobalKeplrProvider,
  getPrefix,
  getToken,
  useAccountExists,
  useFee,
  useTokenBalance,
  useTransfer,
} from "evmos-wallet";
import { AccountSelector } from "../shared/AccountSelector";

import { TransferSummary } from "../shared/TransferSummary";
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
  CLICK_ON_AXL_REDIRECT,
  CLICK_ON_TOP_UP_EVMOS,
  INSUFFICIENT_FEE_AMOUNT,
  useTracker,
} from "tracker";
import { CLICK_ON_CONNECT_WITH_KEPLR_SEND_FLOW } from "tracker/src/constants";

import { sortedChains } from "../shared/sortedChains";
import { TransferModalProps } from "./TransferModal";
import { useReceiptModal } from "../receipt/ReceiptModal";
import { useTopupModal } from "../topup/TopupModal";

export const TransferModalContent = ({
  receiver,
  networkPrefix,
  tokenSourcePrefix,
  denom,
  amount,
  setState,
}: TransferModalProps) => {
  const { t } = useTranslation();
  const { sendEvent } = useTracker();
  const { isDisconnected } = useAccount();
  const wallet = useSelector((state: StoreType) => state.wallet.value);
  const dispatch = useDispatch();
  const receiptModal = useReceiptModal();
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
      sendEvent(INSUFFICIENT_FEE_AMOUNT);
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

  const topupModal = useTopupModal();

  const topUpEvmos =
    errors.has("insufficientBalanceForFee") ||
    // TODO: there was a changed but I'm not sure what value should we use here now
    (errors.has("insufficientBalance") && token.denom === "EVMOS");

  const isAxelarBased = useMemo(() => {
    return "handledByExternalUI" in token;
  }, [token]);

  const sendButtonText = useMemo(() => {
    if (topUpEvmos) {
      return t("transfer.top.up.button.text");
    }

    if (isAxelarBased) {
      return t("transfer.bridge.button.text");
    }

    return t("transfer.send.button.text");
  }, [topUpEvmos, isAxelarBased, t]);

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

  useEffect(() => {
    if (!transferData) return;
    if (!isString(transferData.hash)) return;
    // receiptModal.setIsOpen(true, {
    //   hash: transferData.hash,
    //   chainPrefix: networkPrefix,
    // });
  }, [transferData]);

  const isCTAEnabled = useMemo(() => {
    if (isTransferring || !isReadyToTransfer) {
      return false;
    }

    if (isAxelarBased) {
      return true;
    }

    if (topUpEvmos) {
      return true;
    }

    if (
      errors.has("accountDoesntExist") ||
      errors.has("networkNotSupportedByConnectedWallet") ||
      errors.has("userRejectedEnablingNetwork")
    ) {
      return false;
    }

    if (
      // CTA is disabled if the user doesn't have enough balance and the token is not evmos.
      errors.has("insufficientBalance") &&
      // what value should we use if I want to check for the token that is selected ?
      token.denom !== "EVMOS"
    ) {
      return false;
    }

    return true;
  }, [
    errors,
    token,
    isAxelarBased,
    topUpEvmos,
    isReadyToTransfer,
    isTransferring,
  ]);

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

          if (topUpEvmos) {
            topupModal.setIsOpen(true);
            sendEvent(CLICK_ON_TOP_UP_EVMOS);
            // TODO: close send modal
            return;
          }

          if ("handledByExternalUI" in token) {
            window.open(token.handledByExternalUI[0].url, "_blank");
            sendEvent(CLICK_ON_AXL_REDIRECT);
            // TODO: close send modal
            return;
          }

          transfer();
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
                  <Trans
                    i18nKey="error.user.rejected.network.title"
                    components={{
                      strong: <span className="text-pink-300" />,
                    }}
                  />
                  <span className="text-pink-300">
                    {chains[networkPrefix].name}
                  </span>
                  <Trans
                    i18nKey="error.user.rejected.network.title2"
                    components={{
                      strong: <span className="text-pink-300" />,
                    }}
                  />
                </p>

                <p className="pb-8">
                  <Trans
                    i18nKey="error.user.rejected.network.subtitle"
                    components={{
                      strong: <span className="text-pink-300" />,
                    }}
                  />
                </p>
                <PrimaryButton
                  className="font-normal w-full"
                  onClick={() => refetch()}
                >
                  {t("error.user.rejected.network.authorizeButtonLabel")}
                </PrimaryButton>
              </div>
            </InfoPanel>
          )}
          {errors.has("networkNotSupportedByConnectedWallet") && (
            <InfoPanel icon={<IconContainer type={ICONS_TYPES.METAMASK} />}>
              <div className="space-y-4">
                <p>
                  <Trans
                    i18nKey="error.network.not.support.by-wallet.title"
                    components={{
                      strong: <span className="text-pink-300" />,
                    }}
                  />
                </p>
                <p>
                  <Trans
                    i18nKey="error.network.not.support.by-wallet.subtitle"
                    components={{
                      strong: <span className="text-pink-300" />,
                    }}
                  />
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
                    sendEvent(CLICK_ON_CONNECT_WITH_KEPLR_SEND_FLOW);
                    // TODO: handle error when user rejects the connection
                    if (err) return false;
                  }}
                >
                  {getGlobalKeplrProvider() === null
                    ? t(
                        "error.network.not.support.by-wallet.installButtonLabel"
                      )
                    : t(
                        "error.network.not.support.by-wallet.connectButtonLabel"
                      )}
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
          {/* To Julia: I think that it's not necessary to show this message. We should focus on the fee error instead of the balance (in the sending summary) */}
          {/* TODO: this should appear when we add the opacity to the transfer summary because the user doesn't have enough evmos to pay the fee */}
          {/* {errors.has("insufficientBalance") && (
            <ErrorMessage className="justify-center pl-0">
              {t("message.insufficient.balance")}
              {balance?.formattedLong ?? "0"} {token.denom}
            </ErrorMessage>
          )} */}
          {errors.has("insufficientBalanceForFee") && feeTokenbalance && (
            <ErrorMessage className="justify-center pl-0">
              {/* TODO: the message might be different if the insufficient token is the fee token? */}
              {t("message.insufficiente.fee")}
              {feeTokenbalance.formattedLong} {feeTokenbalance.denom}
            </ErrorMessage>
          )}

          {isAxelarBased && (
            <ErrorMessage className="justify-center pl-0" variant="info">
              <Trans
                i18nKey="error.send.axelar.assets.text"
                components={{
                  strong: <span className="text-pink-300" />,
                }}
              />
            </ErrorMessage>
          )}
          {isDisconnected && (
            // TODO: add tracker event and add styles to the button
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
              type="submit"
              variant={
                topUpEvmos || isAxelarBased ? "outline-primary" : "primary"
              }
              className="w-full text-lg rounded-md capitalize mt-5"
              disabled={!isCTAEnabled}
              //
            >
              {sendButtonText}
            </PrimaryButton>
          )}

          {isTransferring && (
            <p>Please, check your wallet to sign your transaction</p>
          )}
        </section>
      </form>

      <button
        onClick={() =>
          receiptModal.setIsOpen(true, {
            hash: "0x42218494f3257db4a0ba998245c5d5803222c8a2707b5534e4669f92c69ab672",
            chainPrefix: "evmos",
          })
        }
      >
        Test open receipt modal
      </button>
      <br />
      <button
        onClick={() => {
          // To Milli 🫠: I wrapped the topup modal in the new modal routing thingy,
          // you can check it in apps/assets/src/components/topBarButtons/topup/TopupModal.tsx
          //
          // The idea is to decouple the modal from what triggers the modal,
          // so you don't have to embed the modal in the same component as the modal
          // or have the modal as child of other modals, etc.
          //
          // I think after we finish here we could move all these modals somewhere that are acessible from the other apps too
          // even though I think now most of them only exist in the assets app, I think it's nice to have them decoupled from it
          //
          // Also, because they are route based, they automatically close when another opens, and going back and forward in browser history works too
          // (Although obviously, it will not work for individual steps on the copilot since it's being controlled on the provider)
          // Although I think this is nice for most cases, there are some cases where it's not desirable,
          // Ex: Opening the "connect" modal from the transfer modal and returning to it once you're connected

          // Once solution would be to have the "connect" modal to take a "returnTo" route argument, so it knows where to go back to once it's done
          // I added support for opening modals with prefilled parameters so it would look something like this:
          //
          // connectModal.setIsOpen(true, { returnTo: "/assets/action=transfer&...." })
          //
          // Anyway, let me know your thoughts
          //
          topupModal.setIsOpen(true);
        }}
      >
        Test open topup modal
      </button>
    </section>
  );
};
