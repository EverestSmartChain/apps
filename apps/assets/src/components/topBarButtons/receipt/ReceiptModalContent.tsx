import { useTranslation } from "next-i18next";

import {
  PrimaryButton,
  ContainerConfirmation,
  ViewExplorer,
  ConfirmationTitle,
  ConfirmationMessage,
  Divider,
  ContainerItem,
  ConfirmationText,
  AddressDisplay,
} from "ui-helpers";

import { FetchTransactionResult, fetchTransaction } from "wagmi/actions";
import { Hex, decodeFunctionData, formatUnits } from "viem";
import {
  Address,
  ICS20_ADDRESS,
  MsgTransfer,
  apiCosmosBlockByHeight,
  apiCosmosTxByHash,
  getAbi,
  getChain,
  getTokens,
  normalizeToCosmosAddress,
} from "evmos-wallet";
import { FailTxIcon, ProcessingTxIcon, SuccessTxIcon } from "icons";
import { Prefix, Token } from "evmos-wallet/src/registry-actions/types";
import { findToken } from "evmos-wallet/src/registry-actions/utils";
import { useQuery } from "@tanstack/react-query";
import { SkeletonLoading } from "../shared/SkeletonLoading";
import { E, raise } from "helpers";
import { ReceiptModalProps } from "./ReceiptModal";
import { getTokenByRef } from "evmos-wallet/src/registry-actions/get-token-by-ref";
import { useEffect, useState } from "react";
import { getFormattedDate } from "helpers";
const generateReceipt = ({
  sender,
  receiver,
  amount,
  token,
  height,
}: {
  sender: string;
  receiver: string;
  amount: bigint | number | string;
  token: Token;
  height: string | number | bigint;
}) => ({
  sender: normalizeToCosmosAddress(sender as Address<Prefix>),
  receiver: normalizeToCosmosAddress(receiver as Address<Prefix>),
  formattedAmount: `${formatUnits(BigInt(amount), token.decimals)} ${
    token.denom
  }`,
  height: BigInt(height),
});

const generateICS20TransferReceipt = (result: FetchTransactionResult) => {
  const { args, functionName } = decodeFunctionData({
    abi: getAbi("ics20"),
    data: result.input,
  });
  if (!args || functionName !== "transfer") throw new Error("Missing args");

  const [, , denom, amount, sender, receiver] = args;
  if (!denom || !amount || !sender || !receiver)
    throw new Error("Missing args");

  return generateReceipt({
    sender,
    receiver,
    amount,
    token:
      findToken({
        denom,
      }) ?? raise("Token not found"),
    height: result.blockNumber,
  });
};

const generateERC20TransferReceipt = (result: FetchTransactionResult) => {
  const { args, functionName } = decodeFunctionData({
    abi: getAbi("erc20"),
    data: result.input,
  });

  if (!args || functionName !== "transfer") throw new Error("Missing args");

  const [receiver, amount] = args;

  if (!amount || !amount || !receiver) throw new Error("Missing args");
  const tokenErc20Address = result.to?.toLowerCase();
  if (!tokenErc20Address) throw new Error("Missing token contract address");
  const token =
    getTokens().find(
      (token) => token.erc20Address?.toLowerCase() === tokenErc20Address
    ) ?? raise("Token not found");

  return generateReceipt({
    sender: result.from,
    receiver,
    amount,
    token,
    height: result.blockNumber,
  });
};

const generateEVMTxReceipt = (result: FetchTransactionResult) => {
  return generateReceipt({
    sender: result.from,
    receiver: result.to ?? raise("Missing receiver"),
    amount: result.value,
    token: getTokenByRef("evmos:EVMOS"),
    height: result.blockNumber,
  });
};

const isIBCMsgTransfer = (message: unknown): message is MsgTransfer => {
  return (
    typeof message === "object" &&
    message !== null &&
    "@type" in message &&
    message["@type"] === "/ibc.applications.transfer.v1.MsgTransfer"
  );
};

const useReceipt = (hash?: Hex, chainPrefix?: Prefix) => {
  const { data, ...rest } = useQuery({
    queryKey: ["receipt", hash],
    enabled: !!hash && !!chainPrefix,
    retry: 100,
    retryDelay: 3000,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      if (!hash || !chainPrefix) throw new Error("Missing parameters");
      /**
       * All transactions originated on Evmos are sent through Precompiles, so we fetch the results as
       * ethereum transactions
       */
      if (chainPrefix === "evmos") {
        const result = await fetchTransaction({
          hash: hash,
        });

        if (result.input === "0x") {
          return generateEVMTxReceipt(result);
        }

        if (result.to === ICS20_ADDRESS) {
          return generateICS20TransferReceipt(result);
        }
        return generateERC20TransferReceipt(result);
      }

      /**
       * All transactions originated on Cosmos are sent through the Cosmos SDK, so we fetch the results as
       * cosmos transactions
       */
      const chainConfig = getChain(chainPrefix);
      const result = await apiCosmosTxByHash(chainConfig.cosmosRest, hash);
      const message = { ...result.tx.body.messages[0] } as const;

      if (result.tx_response.code !== 0) {
        throw new Error(`Transaction failed: ${result.tx_response.raw_log}`);
      }
      if (!isIBCMsgTransfer(message)) {
        throw new Error("Unsupported transaction type");
      }
      const token =
        findToken({
          denom: message.token.denom,
        }) ?? raise("Token not found");
      return generateReceipt({
        sender: message.sender,
        receiver: message.receiver,
        amount: message.token.amount,
        token,
        height: result.tx_response.height,
      });
    },
  });
  return {
    receipt: data,
    ...rest,
  };
};

const useBlock = (prefix?: Prefix, height?: bigint) => {
  return useQuery({
    queryKey: ["block", prefix, height?.toString()],

    queryFn: async () => {
      if (!height || !prefix) throw new Error("Missing parameters");
      const chainConfig = getChain(prefix);
      const result = await apiCosmosBlockByHeight(
        chainConfig.cosmosRest,
        height
      );
      return result;
    },
    enabled: !!height && !!prefix,
  });
};

export const ReceiptModalContent = ({
  hash,
  chainPrefix,
  setIsOpen,
}: ReceiptModalProps) => {
  const {
    receipt,
    isLoading: isReceiptLoading,
    error,
  } = useReceipt(hash, chainPrefix);

  const { t } = useTranslation();

  const { data: block, isLoading: isFetchingBlock } = useBlock(
    chainPrefix,
    receipt?.height
  );
  const chain = getChain(chainPrefix ?? "evmos");
  const blockDate = block?.block?.header?.time
    ? new Date(block.block.header.time)
    : undefined;

  const txHasNotFoundError = E.match.byPattern(error, /(could not be found)/g);

  const [isReceiptStillLoading, setIsReceiptStillLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReceiptStillLoading(isReceiptLoading);
    }, 12000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drawTextButton = () => {
    if (receipt || (!!error && !txHasNotFoundError)) {
      return t("transfer.confirmation.button.text");
    }
    if (txHasNotFoundError || (isReceiptStillLoading && !error)) {
      return t("transfer.confirmation.button.mintscan.text");
    }
    return (
      <>
        <div className="animate-pulse bg-black/20 rounded-full h-5 w-5 mr-1" />
        {t("transfer.confirmation.button.text.loading")}
      </>
    );
  };

  return (
    <>
      <ContainerConfirmation>
        {!!error && !txHasNotFoundError && <FailTxIcon />}
        {receipt && <SuccessTxIcon />}
        {isReceiptLoading && <ProcessingTxIcon />}
        {!!error && txHasNotFoundError && <ProcessingTxIcon />}

        <div className="flex flex-col items-center space-y-2">
          <ConfirmationTitle
            variant={
              receipt
                ? "success"
                : error && !txHasNotFoundError
                ? "error"
                : "loading"
            }
          >
            <SkeletonLoading loading={isReceiptLoading}>
              {receipt && t("transfer.confirmation.message.successful")}
              {!!error &&
                !txHasNotFoundError &&
                t("transfer.confirmation.message.unsuccessful")}
              {isReceiptLoading &&
                !isReceiptStillLoading &&
                t("transfer.confirmation.message.processing.title")}
              {((isReceiptLoading && isReceiptStillLoading) ||
                (isReceiptStillLoading && txHasNotFoundError)) &&
                t("transfer.confirmation.message.taking.longer.title")}
            </SkeletonLoading>
          </ConfirmationTitle>

          <ConfirmationMessage>
            <SkeletonLoading loading={isReceiptLoading}>
              {receipt && (
                <span data-testid="tx-receipt-success-message">
                  {t("transfer.confirmation.message.successful.description")}
                  <br />
                  {t("transfer.confirmation.message.successful.description2")}
                </span>
              )}
              {!!error && !txHasNotFoundError && (
                <span className="break-all">
                  {E.ensureError(error).message}
                </span>
              )}
              {isReceiptLoading && !isReceiptStillLoading && (
                <>
                  {t("transfer.confirmation.message.processing.description")}
                  <br />
                  {t("transfer.confirmation.message.processing.description2")}
                </>
              )}
              {((isReceiptLoading && isReceiptStillLoading) ||
                (!!error && txHasNotFoundError)) && (
                <>
                  {t("transfer.confirmation.message.taking.longer.description")}
                  <br />
                  {t(
                    "transfer.confirmation.message.taking.longer.description2"
                  )}
                </>
              )}
            </SkeletonLoading>
          </ConfirmationMessage>
        </div>
        <Divider variant="info" className="w-full">
          <ViewExplorer
            txHash={chainPrefix !== "evmos" ? hash?.slice(2) ?? "" : hash ?? ""}
            explorerTxUrl={chain.explorerUrl}
            text={`Transaction ID: ${hash?.slice(0, 10)}...`}
          />
        </Divider>
        {(!error || txHasNotFoundError) && (
          <div className="w-full space-y-2">
            <ContainerItem>
              <ConfirmationText>
                {t("transfer.confirmation.total.amount.sent")}
              </ConfirmationText>

              <p>
                <SkeletonLoading loading={isReceiptLoading}>
                  {receipt && receipt.formattedAmount}
                </SkeletonLoading>
              </p>
            </ContainerItem>
            <ContainerItem>
              <ConfirmationText>
                {t("transfer.confirmation.recipient.address")}
              </ConfirmationText>

              <p>
                <SkeletonLoading className="w-24" loading={isReceiptLoading}>
                  {receipt && <AddressDisplay address={receipt.receiver} />}
                </SkeletonLoading>
              </p>
            </ContainerItem>
            <ContainerItem>
              <ConfirmationText>
                {t("transfer.confirmation.date")}
              </ConfirmationText>

              <p>
                <SkeletonLoading loading={isReceiptLoading || isFetchingBlock}>
                  {blockDate && getFormattedDate(blockDate)}
                </SkeletonLoading>
              </p>
            </ContainerItem>
          </div>
        )}
      </ContainerConfirmation>

      <PrimaryButton
        onClick={() => {
          if (
            txHasNotFoundError ||
            (isReceiptStillLoading && !receipt && !error)
          ) {
            window.open(chain.explorerUrl + "/" + hash, "_blank");
          }
          setIsOpen(false);
        }}
        className="w-full text-lg rounded-md normal-case mt-11"
        variant={
          txHasNotFoundError || (isReceiptStillLoading && !receipt && !error)
            ? "outline-primary"
            : "primary"
        }
      >
        {drawTextButton()}
      </PrimaryButton>
    </>
  );
};
