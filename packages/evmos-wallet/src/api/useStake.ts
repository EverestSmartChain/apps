// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:ENCL-1.0(https://github.com/evmos/apps/blob/main/LICENSE)

import { useQuery } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { convertStringFromAtto } from "helpers";
import { StakingInfoResponse } from "./types";
import { getStakingInfo } from "./fetch";
import { StoreType } from "../redux/Store";

export const useStake = () => {
  const value = useSelector((state: StoreType) => state.wallet.value);

  const stakingInfo = useQuery<StakingInfoResponse, Error>({
    queryKey: ["stakingInfo", value.evmosAddressCosmosFormat],
    queryFn: () => getStakingInfo(value.evmosAddressCosmosFormat),
  });

  const totalStaked = useMemo(() => {
    let total = BigNumber.from(0);
    if (stakingInfo.data !== undefined) {
      const sum = stakingInfo.data.delegations.reduce((prev, curr) => {
        return prev.add(BigNumber.from(curr?.balance.amount));
      }, total);
      total = sum ? sum : BigNumber.from(0);

      return total;
    }

    return total;
  }, [stakingInfo]);

  const totalRewards = useMemo(() => {
    let total = "0";
    if (
      stakingInfo.data !== undefined &&
      stakingInfo.data.rewards !== undefined &&
      stakingInfo.data.rewards.total.length !== 0
    ) {
      // the sum is already done in the backend
      total = stakingInfo.data.rewards.total[0].amount;
    }

    return Number(convertStringFromAtto(total));
  }, [stakingInfo]);

  return { totalStaked, totalRewards, wallet: value };
};
