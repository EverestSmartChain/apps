/* eslint-disable */
/**
 * DO NOT MANUALLY EDIT THIS FILE!
 * This file is generated by calling the `pnpm run build:registry` command.
 * 
 * You can find the source code for this script on /scripts/typegen.ts
 */

export default {
  "prefix": "axelar",
  "name": "Axelar",
  "cosmosId": "axelar-dojo-1",
  "identifier": "axelar",
  "gasPriceStep": {
    "low": "0.00005",
    "average": "0.00025",
    "high": "0.0004"
  },
  "evmId": null,
  "channels": {
    "evmos": {
      "channelId": "channel-22",
      "counterpartyChannelId": "channel-21"
    }
  },
  "feeToken": "uaxl",
  "cosmosRest": [
    "https://g.w.lavanet.xyz:443/gateway/axelar/rest/ef1ad852a77275e1eeef6c7972370118",
    "https://rest.cosmos.directory/axelar",
    "https://lcd-axelar.imperator.co:443",
    "https://axelar-lcd.quickapi.com:443",
    "https://axelar-rest.chainode.tech:443",
    "https://axelar-lcd.qubelabs.io:443",
    "https://api-1.axelar.nodes.guru:443",
    "https://api-axelar-ia.cosmosia.notional.ventures/",
    "https://axelar-api.polkachu.com"
  ],
  "tendermintRest": [
    "https://g.w.lavanet.xyz:443/gateway/axelar/rpc-http/ef1ad852a77275e1eeef6c7972370118",
    "https://rpc.cosmos.directory/axelar",
    "https://axelar-grpc.quantnode.tech:9090"
  ],
  "evmRest": null,
  "cosmosGRPC": [
    "https://axelar-grpc.quantnode.tech:9090"
  ],
  "tokens": [
    {
      "name": "Lido staked ETH by Axelar",
      "ref": "axelar:axlWSTETH",
      "description": "Lido staking derivative wstETH for staked ETH on Axelar",
      "symbol": "axlWSTETH",
      "denom": "axlWSTETH",
      "sourcePrefix": "axelar",
      "sourceDenom": "axlwsteth",
      "minCoinDenom": "wsteth-wei",
      "category": "ethereum",
      "tokenRepresentation": "Lido",
      "type": "IBC",
      "decimals": 18,
      "erc20Address": "0xA2A4B12EF81E7A26C5a1E0be9340b1972F85E44A",
      "handledByExternalUI": [
        {
          "url": "https://satellite.money/",
          "handlingAction": "Deposit and Withdraw"
        }
      ],
      "listed": true
    },
    {
      "name": "Wrapped Ether on Axelar",
      "ref": "axelar:axlWETH",
      "description": "Wrapped Ether on Axelar",
      "symbol": "axlWETH",
      "denom": "axlWETH",
      "sourcePrefix": "axelar",
      "sourceDenom": "weth-wei",
      "minCoinDenom": "weth-wei",
      "category": "ethereum",
      "tokenRepresentation": "WETH",
      "type": "IBC",
      "decimals": 18,
      "erc20Address": "0x50dE24B3f0B3136C50FA8A3B8ebc8BD80a269ce5",
      "handledByExternalUI": [
        {
          "url": "https://satellite.money/",
          "handlingAction": "Deposit and Withdraw"
        }
      ],
      "listed": true
    },
    {
      "name": "Wrapped Bitcoin on Axelar",
      "ref": "axelar:axlWBTC",
      "description": "Wrapped Bitcoin on Axelar",
      "symbol": "axlWBTC",
      "denom": "axlWBTC",
      "sourcePrefix": "axelar",
      "sourceDenom": "wbtc-satoshi",
      "minCoinDenom": "wbtc-satoshi",
      "category": "bitcoin",
      "tokenRepresentation": "WBTC",
      "type": "IBC",
      "decimals": 8,
      "erc20Address": "0xF5b24c0093b65408ACE53df7ce86a02448d53b25",
      "handledByExternalUI": [
        {
          "url": "https://satellite.money/",
          "handlingAction": "Deposit and Withdraw"
        }
      ],
      "listed": true
    },
    {
      "name": "USDT by Axelar",
      "ref": "axelar:axlUSDT",
      "description": "USD Tether Stablecoin on Axelar",
      "symbol": "axlUSDT",
      "denom": "axlUSDT",
      "sourcePrefix": "axelar",
      "sourceDenom": "uusdt",
      "minCoinDenom": "uusdt",
      "category": "stablecoin",
      "tokenRepresentation": "USDT",
      "type": "IBC",
      "decimals": 6,
      "erc20Address": "0xe01C6D4987Fc8dCE22988DADa92d56dA701d0Fe0",
      "handledByExternalUI": [
        {
          "url": "https://satellite.money/",
          "handlingAction": "Deposit and Withdraw"
        }
      ],
      "listed": true
    },
    {
      "name": "USD Coin by Axelar",
      "ref": "axelar:axlUSDC",
      "description": "Circle's stablecoin on Axelar",
      "symbol": "axlUSDC",
      "denom": "axlUSDC",
      "sourcePrefix": "axelar",
      "sourceDenom": "uusdc",
      "minCoinDenom": "uusdc",
      "category": "stablecoin",
      "tokenRepresentation": "USDC",
      "type": "IBC",
      "decimals": 6,
      "erc20Address": "0x15C3Eb3B621d1Bff62CbA1c9536B7c1AE9149b57",
      "handledByExternalUI": [
        {
          "url": "https://satellite.money/",
          "handlingAction": "Deposit and Withdraw"
        }
      ],
      "listed": true
    },
    {
      "name": "Rocket Pool staked ETH by Axelar",
      "ref": "axelar:axlRETH",
      "description": "Rocket Pool staking derivative rETH for staked ETH on Axelar",
      "symbol": "axlRETH",
      "denom": "axlRETH",
      "sourcePrefix": "axelar",
      "sourceDenom": "axlreth",
      "minCoinDenom": "reth-wei",
      "category": "ethereum",
      "tokenRepresentation": "Rocket Pool",
      "type": "IBC",
      "decimals": 18,
      "erc20Address": "0xE60CE2dfa6D4Ad37Ade1dcB7aC4D6C3A093b3A7E",
      "handledByExternalUI": [
        {
          "url": "https://satellite.money/",
          "handlingAction": "Deposit and Withdraw"
        }
      ],
      "listed": true
    },
    {
      "name": "Pepe by Axelar",
      "ref": "axelar:axlPEPE",
      "description": "Pepe on Axelar",
      "symbol": "axlPEPE",
      "denom": "axlPEPE",
      "sourcePrefix": "axelar",
      "sourceDenom": "axlpepe",
      "minCoinDenom": "pepe-wei",
      "category": "ethereum",
      "tokenRepresentation": "PEPE",
      "type": "IBC",
      "decimals": 18,
      "erc20Address": "0xc76A204AEA61a68a3B1f97B8E70286CD42B020D2",
      "handledByExternalUI": [
        {
          "url": "https://satellite.money/",
          "handlingAction": "Deposit and Withdraw"
        }
      ],
      "listed": true
    },
    {
      "name": "DAI by Axelar",
      "ref": "axelar:axlDAI",
      "description": "DAI Stablecoin on Axelar",
      "symbol": "axlDAI",
      "denom": "axlDAI",
      "sourcePrefix": "axelar",
      "sourceDenom": "axldai",
      "minCoinDenom": "dai-wei",
      "category": "stablecoin",
      "tokenRepresentation": "DAI",
      "type": "IBC",
      "decimals": 18,
      "erc20Address": "0x4A2a90D444DbB7163B5861b772f882BbA394Ca67",
      "handledByExternalUI": [
        {
          "url": "https://satellite.money/",
          "handlingAction": "Deposit and Withdraw"
        }
      ],
      "listed": true
    },
    {
      "name": "Axelar",
      "ref": "axelar:AXL",
      "description": "The native token of Axelar",
      "symbol": "AXL",
      "denom": "AXL",
      "sourcePrefix": "axelar",
      "sourceDenom": "uaxl",
      "minCoinDenom": "uaxl",
      "category": "cosmos",
      "tokenRepresentation": "AXL",
      "type": "IBC",
      "decimals": 6,
      "erc20Address": "0x94c23eE865E3c963A56263d0ce2CBF5C6cE7ce2d",
      "handledByExternalUI": null,
      "listed": true
    }
  ],
  "explorerUrl": "https://www.mintscan.io/axelar/txs",
  "env": "mainnet"
} as const;