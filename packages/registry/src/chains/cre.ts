/* eslint-disable */
/**
 * DO NOT MANUALLY EDIT THIS FILE!
 * This file is generated by calling the `pnpm run build:registry` command.
 * 
 * You can find the source code for this script on /scripts/typegen.ts
 */

export default {
  "prefix": "cre",
  "name": "Crescent Network",
  "cosmosId": "crescent-1",
  "identifier": "crescent",
  "gasPriceStep": {
    "low": "0.01",
    "average": "0.025",
    "high": "0.03"
  },
  "evmId": null,
  "channels": {
    "evmos": {
      "channelId": "channel-7",
      "counterpartyChannelId": "channel-11"
    }
  },
  "feeToken": "ucre",
  "cosmosRest": [
    "https://rest.cosmos.directory/crescent",
    "https://mainnet.crescent.network:1317",
    "https://api-crescent.pupmos.network",
    "https://crescent-api.polkachu.com",
    "https://crescent.rest.stakin-nodes.com",
    "https://crescent-mainnet-lcd.autostake.net:443"
  ],
  "tendermintRest": [
    "https://rpc.cosmos.directory/crescent"
  ],
  "evmRest": null,
  "cosmosGRPC": null,
  "evmRPC": null,
  "tokens": [
    {
      "name": "Crescent Network",
      "ref": "cre:CRE",
      "description": "The native token of Crecent Network",
      "symbol": "CRE",
      "denom": "CRE",
      "sourcePrefix": "cre",
      "sourceDenom": "ucre",
      "minCoinDenom": "ucre",
      "category": "cosmos",
      "tokenRepresentation": "CRE",
      "type": "IBC",
      "decimals": 6,
      "erc20Address": "0x628A41754edfAFB491FEe6a1F397590B9013E01B",
      "handledByExternalUI": null
    }
  ],
  "explorerUrl": "https://www.mintscan.io/crescent/txs"
} as const;