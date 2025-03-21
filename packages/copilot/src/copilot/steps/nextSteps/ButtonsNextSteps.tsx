import { useContext } from "react";
import { StepsContext } from "../../container/StepsContext";
import { Button } from "./button/Button";
import { Badge } from "ui-helpers";
import { TitleButton } from "./button/TitleButton";
import { t } from "../../../locales/translate";
import {
  handleInteractWithdApp,
  handleLearnMore,
  handleStakeWithEvmos,
} from "./helpers";
import {
  CLICK_ON_INTERACT_WITH_DAPP_COPILOT,
  CLICK_ON_LEARN_MORE_COPILOT,
  CLICK_ON_STAKE_YOUR_EVMOS_COPILOT,
  useTracker,
} from "tracker";
import { ECOSYSTEM_URL, STAKING_URL } from "constants-helper";

export const ButtonsNextSteps = () => {
  const { setShowModal, resetSteps } = useContext(StepsContext);

  const { handlePreClickAction: trackInteractWithdAppClick } = useTracker(
    CLICK_ON_INTERACT_WITH_DAPP_COPILOT,
  );
  const { handlePreClickAction: trackStakeEvmosClick } = useTracker(
    CLICK_ON_STAKE_YOUR_EVMOS_COPILOT,
  );
  const { handlePreClickAction: trackLearnMoreClick } = useTracker(
    CLICK_ON_LEARN_MORE_COPILOT,
  );
  // TODO: use ecosystem, staking and academy link from locales
  return (
    <>
      <div className="grid w-full grid-cols-1 space-y-3 pb-3 pt-5 md:grid-cols-2 md:space-x-4 md:space-y-0">
        <Button
          handleClick={() => {
            handleInteractWithdApp(ECOSYSTEM_URL, setShowModal);
            trackInteractWithdAppClick();
            resetSteps();
          }}
        >
          <TitleButton text={t("nextsteps.interactWithdApp.title") as string} />
          <Badge variant="success">
            {t("nextsteps.interactWithdApp.badge")}
          </Badge>
        </Button>

        <Button
          handleClick={() => {
            handleStakeWithEvmos(STAKING_URL, setShowModal);
            trackStakeEvmosClick();
            resetSteps();
          }}
        >
          <TitleButton text={t("nextsteps.stakeEvmos.title") as string} />

          <Badge variant="warning">{t("nextsteps.stakeEvmos.badge")}</Badge>
        </Button>
      </div>
      <button
        className="border-gray300 w-full cursor-pointer rounded-lg border py-3 shadow transition-all duration-300 hover:shadow-md"
        onClick={() => {
          handleLearnMore("https://academy.evmos.org/faq", setShowModal);
          trackLearnMoreClick();
          resetSteps();
        }}
      >
        <TitleButton text={t("nextsteps.learnMore.title") as string} />
      </button>
    </>
  );
};
