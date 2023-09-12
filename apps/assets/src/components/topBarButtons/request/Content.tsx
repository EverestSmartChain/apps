// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:ENCL-1.0(https://github.com/evmos/apps/blob/main/LICENSE)
import React from "react";
import { PrimaryButton, Subtitle, Title } from "ui-helpers";
import { useTranslation } from "next-i18next";
import { AssetSelector } from "../parts/AssetSelector";
import { useAccount } from "wagmi";
import {
  connectWith,
  getPrefixes,
  isValidCosmosAddress,
  isValidHexAddress,
} from "evmos-wallet";
import { useModalState } from "../hooks/useModal";
import { SendIcon } from "icons";
import { z } from "zod";
import { chains } from "@evmos-apps/registry";
import { E } from "helpers";
import { useWalletAccountByPrefix } from "../hooks/useAccountByPrefix";
import {
  ChainPrefixSchema,
  MinDenomSchema,
} from "evmos-wallet/src/registry-actions/utils";

const TransferModalSchema = z.object({
  receiver: z.string().transform((v) => {
    if (isValidHexAddress(v) || isValidCosmosAddress(v, [...getPrefixes()])) {
      return v;
    }
    return undefined;
  }),
  chainPrefix: ChainPrefixSchema,
  denom: MinDenomSchema,
  amount: z.coerce.bigint().default(0n),
});
export const Content = () => {
  const { t } = useTranslation();
  const {
    state: { receiver, ...token },
    setState,
  } = useModalState("request", TransferModalSchema, {
    chainPrefix: "evmos",
    denom: "aevmos",
    amount: 0n,
  });

  const { connector } = useAccount();
  const { data, error, refetch } = useWalletAccountByPrefix(token.chainPrefix);

  const sender = data?.bech32Address;

  return (
    <section className="space-y-3">
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
            value={token}
            address={sender}
            onChange={(token) =>
              setState((prev) => ({
                ...prev,
                ...token,
              }))
            }
          />
          {/* TODO: Some error messages. This is not in the specs, so we need to check with Mian how to display those */}
          {E.match.byPattern(error, /USER_REJECTED_REQUEST/) && (
            <div className="text-center space-y-2">
              <p>
                I see you're trying to send tokens from{" "}
                <strong>{chains[token.chainPrefix].name}</strong> using{" "}
                {connector?.name}.
              </p>
              <p>
                For that we need access to your account address. If you want to
                proceed with this transaction, please authorize the request in
                your wallet.
              </p>
              <button
                className="bg-gray-500 text-white rounded-md px-3 py-2"
                onClick={() => refetch()}
              >
                Try again
              </button>
            </div>
          )}

          {E.match.byPattern(error, /NETWORK_NOT_SUPPORTED_BY_WALLET/) && (
            <div className="text-center space-y-2">
              <p>
                I see you're trying to send tokens from{" "}
                <strong>{chains[token.chainPrefix].name}</strong> using{" "}
                {connector?.name}.
              </p>
              <p>
                Currently, only Keplr supports supports sending tokens from
                other networks than Evmos.
              </p>
              <button
                className="bg-gray-500 text-white rounded-md px-3 py-2"
                onClick={() => connectWith("keplr")}
              >
                Connect with Keplr
              </button>
            </div>
          )}
          <PrimaryButton
            // TODO: change variant to outline-primary if the user doesn't have enough balance to pay the fee
            // variant="outline-primary"
            onClick={() => {}}
            className="w-full text-lg rounded-md capitalize mt-5"
            // TODO: we should change the message and the action depending if the user has enought balance to pay the fee or if we have to redirect them to axelar page
            // "transfer.swap.button.text" - "transfer.bridge.button.text"
          >
            {t("transfer.send.button.text")}
          </PrimaryButton>
        </section>
      </form>
    </section>
  );
};
