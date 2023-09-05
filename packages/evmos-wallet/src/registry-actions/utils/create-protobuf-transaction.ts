import { SignMode } from "@buf/cosmos_cosmos-sdk.bufbuild_es/cosmos/tx/signing/v1beta1/signing_pb";
import { Tx } from "@buf/cosmos_cosmos-sdk.bufbuild_es/cosmos/tx/v1beta1/tx_pb";
import { Message, Any } from "@bufbuild/protobuf";

import { getChainByAddress } from "../get-chain-by-account";
import { getTokenByDenom } from "../get-token-by-denom";
import { Prefix } from "../types";
import { Address } from "../../wallet";
import { getChainAccountInfo } from "./get-chain-account-info";

export const createProtobufTransaction = async ({
  sender,
  messages,
  memo = "",
  mode = "DIRECT",
}: {
  sender: Address<Prefix>;
  messages: Message[];
  memo?: string;
  mode?: keyof typeof SignMode;
}) => {
  const chain = getChainByAddress(sender);
  const { publicKey, sequence } = await getChainAccountInfo(sender);
  const nativeToken = getTokenByDenom(chain.nativeCurrency);

  return new Tx({
    body: {
      memo: memo,
      messages: messages.map(
        (msg) =>
          new Any({
            typeUrl: `/${msg.getType().typeName}`,
            value: msg.toBinary(),
          })
      ),
    },
    authInfo: {
      signerInfos: [
        {
          publicKey: new Any({
            typeUrl: `/${publicKey.getType().typeName}`,
            value: publicKey.toBinary(),
          }),
          modeInfo: {
            sum: {
              case: "single",
              value: {
                mode: SignMode[mode],
              },
            },
          },
          sequence,
        },
      ],
      fee: {
        amount: [
          {
            amount: "0",
            denom: nativeToken.minCoinDenom,
          },
        ],
        gasLimit: 0n,
      },
    },
    signatures: [new Uint8Array()],
  });
};
