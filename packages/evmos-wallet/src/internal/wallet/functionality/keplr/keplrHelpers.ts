// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:ENCL-1.0(https://github.com/evmos/apps/blob/main/LICENSE)

import type { ChainInfo } from "@keplr-wallet/types";
import { networkConfigByName } from "./fetch";
import { getKeplrProvider } from "../../../../wallet";

const networkInfo = async (network: string) => {
  const networkResponse = await networkConfigByName(network);
  if (networkResponse === undefined) {
    return "";
  }
  const networkData = networkResponse?.values;

  const networkConfig = networkData?.configurations[0];
  const currency = networkConfig.currencies[0];
  const currencyData = {
    coinDenom: currency.coinDenom,
    coinDecimals: Number(currency.coinDecimals),
    coinMinimalDenom: currency.coinMinDenom,
  };
  const feeCurrencies = [
    {
      coinDenom: currency.coinDenom,
      coinDecimals: Number(currency.coinDecimals),
      coinMinimalDenom: currency.coinMinDenom,
      gasPriceStep: {
        low: Number(networkData?.gasPriceStep.low),
        average: Number(networkData?.gasPriceStep.average),
        high: Number(networkData?.gasPriceStep.high),
      },
    },
  ];
  const chainInfo: ChainInfo = {
    bech32Config: {
      bech32PrefixAccAddr: `${networkData?.prefix}`,
      bech32PrefixAccPub: `${networkData?.prefix}pub`,
      bech32PrefixValAddr: `${networkData?.prefix}valoper`,
      bech32PrefixValPub: `${networkData?.prefix}valoperpub`,
      bech32PrefixConsAddr: `${networkData?.prefix}valcons`,
      bech32PrefixConsPub: `${networkData?.prefix}valconspub`,
    },
    currencies: [currencyData],
    chainId: networkConfig["chainId"],
    chainName: networkConfig.chainName,
    rpc: networkConfig.rpc[0],
    rest: networkConfig.rest[0],
    stakeCurrency: currencyData,
    feeCurrencies: feeCurrencies,
    bip44: { coinType: Number(networkData?.bip44.coinType) },
    // coinType: Number(networkData?.bip44.coinType),
  };
  return chainInfo;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export async function getKeplrAddressByChain(
  chainId: string,
  network?: string,
) {
  let accounts;
  let offlineSigner;
  try {
    const keplr = await getKeplrProvider();

    offlineSigner = keplr.getOfflineSigner(chainId);
    try {
      accounts = await offlineSigner.getAccounts();
    } catch (e) {
      if (network !== undefined) {
        const chainInfo = await networkInfo(network.toUpperCase());
        if (chainInfo !== "") {
          try {
            await keplr.experimentalSuggestChain(chainInfo);
            // NOTE: keplr bug offlineSigner fails after expermintalSuggestChain
            offlineSigner = keplr.getOfflineSignerOnlyAmino(chainId);
            accounts = await offlineSigner.getAccounts();
          } catch (e) {
            return null;
          }

          if (!accounts || accounts.length === 0) {
            // Could not get accounts information
            return null;
          }
          return accounts[0].address;
        }
      }
    }

    if (!accounts || accounts.length === 0) {
      // Could not get accounts information
      return null;
    }
    return accounts[0].address;
  } catch (e) {
    return null;
  }
}
