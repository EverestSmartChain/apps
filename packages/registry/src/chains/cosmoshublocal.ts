/* eslint-disable */
/**
 * DO NOT MANUALLY EDIT THIS FILE!
 * This file is generated by calling the `pnpm run build:registry` command.
 * 
 * You can find the source code for this script on /scripts/typegen.ts
 */

export default {
  "prefix": "cosmos",
  "name": "Cosmos Hub Local",
  "cosmosId": "cosmolocal-10",
  "identifier": "cosmoshublocal",
  "gasPriceStep": {
    "low": "0.005",
    "average": "0.025",
    "high": "0.04"
  },
  "evmId": null,
  "channels": {
    "evmos": {
      "channelId": "channel-0",
      "counterpartyChannelId": "channel-0"
    }
  },
  "feeToken": "uatom",
  "cosmosRest": [
    "http://localhost:1327"
  ],
  "tendermintRest": [
    "http://localhost:26667"
  ],
  "evmRest": null,
  "cosmosGRPC": [
    "http://localhost:26667"
  ],
  "tokens": [
    {
      "name": "Cosmos Hub",
      "ref": "cosmos:ATOM",
      "description": "The native token of Cosmos Hub",
      "symbol": "ATOM",
      "denom": "ATOM",
      "sourcePrefix": "cosmos",
      "sourceDenom": "uatom",
      "minCoinDenom": "uatom",
      "category": "cosmos",
      "tokenRepresentation": "ATOM",
      "type": "IBC",
      "decimals": 6,
      "erc20Address": "0x80b5a32E4F032B2a058b4F29EC95EEfEEB87aDcd",
      "handledByExternalUI": null,
      "listed": true
    }
  ],
  "explorerUrl": "",
  "env": "localtestnet"
} as const;