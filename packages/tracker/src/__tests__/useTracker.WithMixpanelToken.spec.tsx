import { test, describe, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTracker } from "../useTracker";
import { MixpanelProvider } from "../MixPanelProvider";
import mixpanel from "mixpanel-browser";
import { CLICK_CONNECT_WALLET_BUTTON } from "../constants";

vi.mock("mixpanel-browser", () => {
  return {
    default: {
      init: vi.fn(),
      config: {},
      track: vi.fn(),
    },
  };
});

describe("useTracker with the mixpanel token set", () => {
  const wrapper = ({ children }: { children: JSX.Element }) => {
    return (
      <MixpanelProvider token="testToken" config={{ ip: false }}>
        {children}
      </MixpanelProvider>
    );
  };
  test("should call mixpanel.track", async () => {
    const { result } = renderHook(
      () => useTracker(CLICK_CONNECT_WALLET_BUTTON, { prop: "value" }),
      { wrapper },
    );
    /* eslint-disable-next-line */
    expect(mixpanel.init).toHaveBeenCalledTimes(1);

    await act(() => {
      result.current.handlePreClickAction({ extraProp: "extraValue" });
    });
    /* eslint-disable-next-line */
    expect(mixpanel.track).toHaveBeenCalledWith(CLICK_CONNECT_WALLET_BUTTON, {
      prop: "value",
      extraProp: "extraValue",
    });
  });
});
