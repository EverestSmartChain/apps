/* eslint-disable */
/**
 * DO NOT MANUALLY EDIT THIS FILE!
 * This file is generated by calling the `pnpm run build:registry` command.
 * 
 * You can find the source code for this script on /scripts/typegen.ts
 */

export default {
  "prefix": "evmos",
  "name": "Evmos",
  "cosmosId": "evmos_9001-2",
  "identifier": "evmos",
  "gasPriceStep": {
    "low": "10000000000",
    "average": "25000000000",
    "high": "40000000000"
  },
  "evmId": 9001,
  "channels": null,
  "feeToken": "aevmos",
  "cosmosRest": [
    "https://g.w.lavanet.xyz:443/gateway/evmos/rest/ef1ad852a77275e1eeef6c7972370118",
    "https://rest.cosmos.directory/evmos",
    "https://rest.bd.evmos.org:1317",
    "https://api-evmos-ia.cosmosia.notional.ventures",
    "https://api.evmos.interbloc.org",
    "https://lcd.evmos.bh.rocks",
    "https://lcd.evmos.disperze.network",
    "https://evmos-rest.publicnode.com"
  ],
  "tendermintRest": [
    "https://g.w.lavanet.xyz:443/gateway/evmos/rpc-http/ef1ad852a77275e1eeef6c7972370118",
    "https://rpc.cosmos.directory/evmos",
    "https://grpc.bd.evmos.org:9090"
  ],
  "evmRest": [
    "https://g.w.lavanet.xyz:443/gateway/evmos/json-rpc-http/ef1ad852a77275e1eeef6c7972370118",
    "https://jsonrpc-evmos-ia.cosmosia.notional.ventures",
    "https://evmos-mainnet.public.blastapi.io",
    "https://evmos-evm.publicnode.com",
    "https://evmos.lava.build"
  ],
  "cosmosGRPC": [
    "https://grpc.bd.evmos.org:9090"
  ],
  "tokens": [
    {
      "name": "Tashi",
      "ref": "evmos:TASHI",
      "description": "Tashi",
      "symbol": "TASHI",
      "denom": "TASHI",
      "sourcePrefix": "evmos",
      "sourceDenom": "erc20/0x98fAFD9F714CE0B4bB2870527076F2F314aAed82",
      "minCoinDenom": "tashi",
      "category": "cosmos",
      "tokenRepresentation": "TASHI",
      "type": "IBC",
      "decimals": 18,
      "erc20Address": "0x98fAFD9F714CE0B4bB2870527076F2F314aAed82",
      "handledByExternalUI": null,
      "listed": true
    },
    {
      "name": "NEOKingdom DAO",
      "ref": "evmos:NEOK",
      "description": "NEOKingdom DAO",
      "symbol": "NEOK",
      "denom": "NEOK",
      "sourcePrefix": "evmos",
      "sourceDenom": "erc20/0x655ecB57432CC1370f65e5dc2309588b71b473A9",
      "minCoinDenom": "neok",
      "category": "cosmos",
      "tokenRepresentation": "NEOK",
      "type": "IBC",
      "decimals": 18,
      "erc20Address": "0x655ecB57432CC1370f65e5dc2309588b71b473A9",
      "handledByExternalUI": null,
      "listed": true
    },
    {
      "name": "EVMOS",
      "ref": "evmos:EVMOS",
      "description": "EVMOS",
      "symbol": "EVMOS",
      "denom": "EVMOS",
      "sourcePrefix": "evmos",
      "sourceDenom": "aevmos",
      "minCoinDenom": "aevmos",
      "category": "cosmos",
      "tokenRepresentation": "EVMOS",
      "type": "IBC",
      "decimals": 18,
      "erc20Address": "0xD4949664cD82660AaE99bEdc034a0deA8A0bd517",
      "handledByExternalUI": null,
      "listed": true
    }
  ],
  "explorerUrl": "https://www.mintscan.io/evmos/txs",
  "env": "mainnet"
} as const;