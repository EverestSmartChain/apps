// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:ENCL-1.0(https://github.com/evmos/apps/blob/main/LICENSE)

import { useContext, useMemo } from "react";
import { StepsContext } from "./container/StepsContext";
import { STEP_STATUS } from "constants-helper";
import { StepsContainer } from "./container/StepsContainer";

export const useCopilot = () => {
  const { stepsStatus } = useContext(StepsContext);

  const componentToDraw = useMemo(() => {
    return stepsStatus.find(
      (element) => element.status === STEP_STATUS.CURRENT,
    );
  }, [stepsStatus]);

  const stepsToDraw = useMemo(() => {
    if (stepsStatus.length === 1) {
      return;
    }
    return stepsStatus.map((step) => {
      return <StepsContainer key={step.title} step={step} />;
    });
  }, [stepsStatus]);
  return { componentToDraw, stepsToDraw };
};
