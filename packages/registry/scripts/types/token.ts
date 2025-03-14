/**
 * Token Schema Registry via Evmos Governance
 */
export interface TokenRegistry {
  /**
   * Coin denom representation, i.e BTC
   */
  coinDenom: string;
  /**
   * Minimal coin denom, i.e. satoshi for Bitcoin
   */
  minCoinDenom: string;
  /**
   * Link must be SVG link only. If this image is coming from Github, make sure it has a pattern of 'https://raw.githubusercontent.com/cosmos/chain-registry/master/${chain}/images/${coin}.svg' and the link directly opens the image only and not the site of Github with the image.
   */
  imgSrc?: string;
  /**
   * Link must be png source. If this image is coming from Github, make sure it has a pattern of 'https://raw.githubusercontent.com/cosmos/chain-registry/master/${chain}/images/${coin}.png' and the link directly opens the image only and not the site of Github with the image.
   */
  pngSrc: string;
  type: "IBC" | "ERC-20" | "CW20";
  exponent: string;
  /**
   * Starting with ibc/...
   */
  cosmosDenom: string;
  /**
   * Coin description goes here. This description will be used to describe the coin to the user. Please keep it concise.
   */
  description: string;
  /**
   * Official name of the coin, i.e. EVMOS
   */
  name: string;
  /**
   * Single token representation,i.e. EVMOS, it's the grouping key for the assets page
   */
  tokenRepresentation: string;
  /**
   * Channel must be active. Check https://www.mintscan.io/evmos/relayers and find the right network to see which channel is open on both ends. The value wanted here is the From side of Evmos.
   */
  channel: string;
  /**
   * Default to true
   */
  isEnabled?: boolean;
  /**
   * Hex address only, i.e. 0x. Can be found on the Evmos API TokenPairs endpoint. This field will be populated when the token passes governance.
   */
  erc20Address: string;
  ibc: {
    /**
     * There are two states for sourceDenom. Main chain coins like EVMOS will have their minCoinDenom listed here, however, coins from that ecosystem other than the main coin will require its prefix+hexAddress, i.e. gravity0xxxx... for Gravity's USDC.grv
     */
    sourceDenom?: string;
    /**
     * Chain name, i.e. Cosmos or Osmosis
     */
    source?: string;
    [k: string]: unknown;
  };
  /**
   * If network does not have testnet and the coin is not in the testnet via governance or other means, mark this as true, otherwise, leave as is.
   */
  hideFromTestnet?: boolean;
  /**
   * Official string coingecko uses to search and load the asset. Please insure the text matches exactly.
   */
  coingeckoId: string;
  /**
   * Select a parental category of this asset. If a category does not exist, please feel free to create a PR to update the schema. For example, all wrapped token are part of the parent category, gWBTC is 'bitcoin'.
   */
  category:
    | "bitcoin"
    | "ethereum"
    | "stablecoin"
    | "cosmos"
    | "polygon"
    | "none";
  /**
   * Use this field to declare if the coin is part of a network's ecosystem, like for example, gWBTC is part of Gravity. If the coin is the main network coin, then the response will be itself still. the string here should match the network prefix.
   */
  coinSourcePrefix: string;
  handledByExternalUI?: {
    /**
     * Link to the external UI site
     */
    url: string;
    /**
     * Specify if the external UI is for Deposit, Withdraw, Convert, or others.
     */
    handlingAction:
      | "Deposit"
      | "Withdraw"
      | "Convert"
      | "Deposit and Withdraw"
      | "All";
    [k: string]: unknown;
  }[];
  [k: string]: unknown;
}
