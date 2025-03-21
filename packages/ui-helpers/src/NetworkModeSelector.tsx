import { cn } from "helpers";

import { useEffect, useState } from "react";

export const getSelectedNetworkMode = () => {
  if (typeof window === "undefined") return "mainnet";
  return localStorage.getItem("networkMode") || "mainnet";
};

export const setSelectedNetworkMode = (mode: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("networkMode", mode);
};

const modes = ["mainnet", "testnet", "localtestnet"];

export const isMainnet = () => getSelectedNetworkMode() === "mainnet";
export const NetworkModeSelector = () => {
  const [mode, setMode] = useState<null | string>(null);

  useEffect(() => {
    setMode(getSelectedNetworkMode());
  }, [setMode]);

  if (!mode) return null;
  return (
    <div className="border-2 border-red rounded-md m-4 flex">
      {modes.map((net) => (
        <button
          data-testid={`network-mode-selector-${net}`}
          key={net}
          onClick={() => {
            setMode(net);
            setSelectedNetworkMode(net);
            window.location.reload();
          }}
          className={cn(
            "text-white py-2 px-3 uppercase text-xxs font-bold grow ",
            {
              "bg-red": net === mode,
            }
          )}
        >
          {net}
        </button>
      ))}
    </div>
  );
};
