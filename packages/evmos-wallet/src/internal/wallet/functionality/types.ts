// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:ENCL-1.0(https://github.com/evmos/apps/blob/main/LICENSE)

export type BalanceResponse = {
  balance: {
    amount: string;
    denom: string;
  };
};
