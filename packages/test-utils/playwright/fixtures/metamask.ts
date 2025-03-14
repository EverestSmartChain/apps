import { BrowserContext, test } from "@playwright/test";
import dappwright, { Dappwright } from "@tenkeylabs/dappwright";
import os from "os";
import path from "path";
import { rm } from "fs/promises";
const E2E_TEST_EVMOS_CHAIN_NAME =
  process.env.E2E_TEST_EVMOS_CHAIN_NAME ?? "Evmos";
const E2E_TEST_EVMOS_RPC_URL =
  process.env.E2E_TEST_EVMOS_RPC_URL ?? "https://evmos.lava.build/";
const E2E_TEST_EVMOS_CHAIN_ID = parseInt(
  process.env.E2E_TEST_EVMOS_CHAIN_ID ?? "9001"
);
const E2E_TEST_EVMOS_SYMBOL = process.env.E2E_TEST_EVMOS_SYMBOL ?? "EVMOS";
const mmVersion = "10.26.2";

const clearDappwright = async () => {
  try {
    await rm(path.resolve(os.tmpdir(), "dappwright"), {
      recursive: true,
    });
  } catch (e) {}
};
export const web3Test = test.extend<{
  context: BrowserContext;
  wallet: Dappwright;
}>({
  context: async ({}, use) => {
    await clearDappwright();
    const [wallet, , context] = await dappwright.bootstrap("", {
      wallet: "metamask",
      version: mmVersion,
      seed:
        process.env.E2E_TEST_SEED ??
        "test test test test test test test test test test test junk",
      headless: false,
    });

    await wallet.addNetwork({
      networkName: E2E_TEST_EVMOS_CHAIN_NAME,
      rpc: E2E_TEST_EVMOS_RPC_URL,
      chainId: E2E_TEST_EVMOS_CHAIN_ID,
      symbol: E2E_TEST_EVMOS_SYMBOL,
    });

    await use(context);
  },

  wallet: async ({ context }, use) => {
    const metamask = await dappwright.getWallet("metamask", context);

    await use(metamask);
  },
});

export const web3TestWithoutNetwork = test.extend<{
  context: BrowserContext;
  wallet: Dappwright;
}>({
  context: async ({}, use) => {
    await clearDappwright();
    const [, , context] = await dappwright.bootstrap("", {
      wallet: "metamask",
      version: mmVersion,

      seed:
        process.env.E2E_TEST_SEED ??
        "test test test test test test test test test test test junk",
      headless: false,
    });

    await use(context);
  },

  wallet: async ({ context }, use) => {
    const metamask = await dappwright.getWallet("metamask", context);

    await use(metamask);
  },
});

export const helpers = { web3Test, web3TestWithoutNetwork };
export const mmFixture = {
  test: web3Test,
  ...web3Test,
};

export const noNetworkMMFixture = {
  test: web3TestWithoutNetwork,
  ...web3TestWithoutNetwork,
};
