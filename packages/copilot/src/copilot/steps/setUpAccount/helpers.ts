// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:ENCL-1.0(https://github.com/evmos/apps/blob/main/LICENSE)

import { STEP_STATUS } from "./buttons/utils";
import { GroupStateI, CompleteStepI, HandleStepErrorsI } from "./types";

export const checkAllDoneStatus = (groupState: GroupStateI[]) => {
  return groupState.every(
    (obj) =>
      Object.prototype.hasOwnProperty.call(obj, "status") &&
      obj.status === STEP_STATUS.DONE
  );
};

export const handleStepError = ({
  setStatus,
  setText,
  step,
  setTextError,
  index,
  text,
}: HandleStepErrorsI) => {
  setStatus(STEP_STATUS.CURRENT);
  setText(text);
  if (step.errorsText) {
    const errorText =
      step.errorsText && step.errorsText.filter((_, i) => i === index).shift();
    if (errorText !== undefined) {
      setTextError(errorText);
    }
  }
};

export const completeStep = ({
  setStatus,
  setGroupState,
  setText,
  step,
}: CompleteStepI) => {
  setText(step.doneText);
  setStatus(STEP_STATUS.DONE);
  setGroupState((state) =>
    state.map((actionGroup) =>
      actionGroup.id === step.id
        ? {
            ...actionGroup,
            status: STEP_STATUS.DONE,
          }
        : actionGroup
    )
  );
};

// if the prevStep is done, set the status to current.
export const updateCurrentStatus = (
  groupState: GroupStateI[],
  currentIndex: number
) => {
  const updatedState = [...groupState];
  const prevStep = updatedState[currentIndex - 1];
  if (prevStep && prevStep.status === STEP_STATUS.DONE) {
    const currentStep = updatedState
      .filter((obj) => obj.index === currentIndex)
      .shift();
    if (currentStep !== undefined) {
      const updatedStep = { ...currentStep, status: STEP_STATUS.CURRENT };
      let temp = updatedState
        .filter((obj) => obj.index === currentIndex)
        .shift();
      if (temp !== undefined) {
        temp = updatedStep;
      }
    }
  }
  return updatedState;
};
