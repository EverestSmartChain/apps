// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:ENCL-1.0(https://github.com/evmos/apps/blob/main/LICENSE)

import { useRouter } from "next/router";
import { Header } from "./header/Header";
import { Navigation } from "ui-helpers";
import { NAV_TO_VESTING } from "constants-helper";
import { AccountDetails } from "./content/AccountDetails";

interface RouterQuery {
  account?: string;
}

const isValidAccount = (account?: string) => {
  // console.log(account);

  if (account === undefined) {
    return "undefined";
  }
  const sanitizedAccount = account?.trim();
  if (sanitizedAccount.startsWith("0x") && sanitizedAccount.length === 42) {
    return sanitizedAccount;
  }
  if (sanitizedAccount.startsWith("evmos")) {
    return sanitizedAccount;
  }
  return false;
};

const Content = () => {
  const router = useRouter();
  const { account }: RouterQuery = router.query;

  const sanitizedAccount = isValidAccount(account);

  return (
    <>
      {sanitizedAccount !== "undefined" && (
        <Navigation href="/" text={NAV_TO_VESTING} />
      )}
      <Header />

      <div className="mt-8 w-full font-[IBM] text-pearl">
        {sanitizedAccount === "undefined" ? (
          <p className="flex justify-center ">
            A list of your vesting accounts will appear here in the next version
          </p>
        ) : (
          <AccountDetails account={sanitizedAccount} />
        )}
      </div>
    </>
  );
};

export default Content;
