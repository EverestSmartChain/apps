// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:ENCL-1.0(https://github.com/evmos/apps/blob/main/LICENSE)

import { BigNumber } from "@ethersproject/bignumber";
import { Dispatch, SetStateAction, useState } from "react";
import { useSelector } from "react-redux";
import { MODAL_NOTIFICATIONS, StoreType } from "evmos-wallet";

import {
  convertFromAtto,
  getReservedForFeeText,
  numericOnly,
  safeSubstraction,
  truncateNumber,
} from "helpers";

import { useEvmosBalance } from "../../../../internal/staking/functionality/hooks/useEvmosBalance";
import { ModalDelegate } from "../../../../internal/staking/functionality/types";
import { useUndelegation } from "../hooks/useUndelegations";
import { FEE_STAKING_ACTIONS } from "constants-helper";
import {
  ContainerInput,
  ErrorMessage,
  ConfirmButton,
  SmallButton,
} from "ui-helpers";

export const Undelegate = ({
  item,
  setShow,
  setShowUndelegate,
}: {
  item: ModalDelegate;
  setShow: Dispatch<SetStateAction<boolean>>;
  setShowUndelegate: Dispatch<SetStateAction<boolean>>;
}) => {
  const { evmosBalance } = useEvmosBalance();
  const [value, setValue] = useState("");
  const wallet = useSelector((state: StoreType) => state.wallet.value);
  const [confirmClicked, setConfirmClicked] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const useUndelegateProps = {
    value,
    setShow,
    wallet,
    item,
    setConfirmClicked,
    setDisabled,
  };

  const { handleConfirmButton } = useUndelegation(useUndelegateProps);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="font-bold">Amount to Undelegate</p>
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
                const val =
                  item.balance !== ""
                    ? BigNumber.from(item.balance)
                    : BigNumber.from(0);
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
        {confirmClicked &&
          safeSubstraction(
            evmosBalance,
            BigNumber.from(FEE_STAKING_ACTIONS),
          ).lte(BigNumber.from(0)) && (
            <ErrorMessage>
              {MODAL_NOTIFICATIONS.ErrorInsufficientFeeSubtext}
            </ErrorMessage>
          )}
        {truncateNumber(value) >
          truncateNumber(
            numericOnly(
              convertFromAtto(
                item.balance !== ""
                  ? BigNumber.from(item.balance)
                  : BigNumber.from(0),
                18,
              ),
            ),
          ) && (
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
            setShowUndelegate(false);
          }}
        />
        <ConfirmButton
          text="Undelegate"
          onClick={handleConfirmButton}
          className="w-fit px-4 text-sm"
          disabled={disabled}
        />
      </div>
    </div>
  );
};
