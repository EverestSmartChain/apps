// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:ENCL-1.0(https://github.com/evmos/apps/blob/main/LICENSE)

import { BigNumber } from "@ethersproject/bignumber";
import { Dispatch, SetStateAction, useState } from "react";
import { useSelector } from "react-redux";
import { MODAL_NOTIFICATIONS, StoreType } from "evmos-wallet";
import { useEvmosBalance } from "../../../../internal/staking/functionality/hooks/useEvmosBalance";
import { ModalDelegate } from "../../../../internal/staking/functionality/types";
import { useDelegation } from "../hooks/useDelegation";
import {
  convertFromAtto,
  convertAndFormat,
  getReservedForFeeText,
  numericOnly,
  safeSubstraction,
  truncateNumber,
} from "helpers";
import { FEE_STAKING_ACTIONS } from "constants-helper";
import {
  ContainerInput,
  ErrorMessage,
  ConfirmButton,
  SmallButton,
} from "ui-helpers";

export const Delegate = ({
  item,
  setShow,
  setShowDelegate,
}: {
  item: ModalDelegate;
  setShow: Dispatch<SetStateAction<boolean>>;
  setShowDelegate: Dispatch<SetStateAction<boolean>>;
}) => {
  const { evmosBalance } = useEvmosBalance();
  const [value, setValue] = useState("");
  const wallet = useSelector((state: StoreType) => state.wallet.value);
  const [confirmClicked, setConfirmClicked] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const useDelegateProps = {
    value,
    setShow,
    wallet,
    item,
    setConfirmClicked,
    evmosBalance,
    setDisabled,
  };

  const { handleConfirmButton } = useDelegation(useDelegateProps);

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <p className="font-bold">Available Balance</p>
        <p>{convertAndFormat(evmosBalance)} EVMOS</p>
      </div>
      <div className="space-y-2">
        <p className="font-bold">Amount to delegate</p>
        <ContainerInput>
          <>
            <input
              className="w-full border-none text-right hover:border-none focus-visible:outline-none"
              type="text"
              placeholder="amount"
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setValue(numericOnly(e.target.value));
              }}
            />
            <SmallButton
              text="MAX"
              onClick={() => {
                const val = safeSubstraction(
                  evmosBalance,
                  BigNumber.from(FEE_STAKING_ACTIONS),
                );
                setValue(numericOnly(convertFromAtto(val, 18)));
              }}
            />
          </>
        </ContainerInput>
        {truncateNumber(value) === 0 && (
          <ErrorMessage>
            {MODAL_NOTIFICATIONS.ErrorZeroAmountSubtext}
          </ErrorMessage>
        )}
        {confirmClicked && value === "" && (
          <ErrorMessage>{MODAL_NOTIFICATIONS.ErrorAmountEmpty}</ErrorMessage>
        )}
        {truncateNumber(value) >
          truncateNumber(numericOnly(convertFromAtto(evmosBalance, 18))) && (
          <ErrorMessage>{MODAL_NOTIFICATIONS.ErrorsAmountGt}</ErrorMessage>
        )}
        <p className="text-sm">
          {getReservedForFeeText(
            BigNumber.from(FEE_STAKING_ACTIONS),
            "EVMOS",
            "EVMOS",
          )}
        </p>
      </div>
      <div className="flex justify-end space-x-2">
        <SmallButton
          className="w-fit"
          text="BACK"
          onClick={() => {
            setShowDelegate(false);
          }}
        />
        <ConfirmButton
          text="Delegate"
          onClick={handleConfirmButton}
          className="w-fit px-4 text-sm"
          disabled={disabled}
        />
      </div>
    </div>
  );
};
