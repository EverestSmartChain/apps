// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:ENCL-1.0(https://github.com/evmos/apps/blob/main/LICENSE)

import { cn } from "helpers";
import { ErrorIcon } from "icons";
import { ComponentProps } from "react";

export function ErrorMessage({
  className,
  variant = "error",
  displayIcon = true,
  ...rest
}: ComponentProps<"p"> & {
  variant?: "error" | "info";
  displayIcon?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center space-x-2 text-xs font-medium pl-4 mt-3",
        className,
        {
          "text-red-300": variant === "error",
          "text-purple-200": variant === "info",
        }
      )}
    >
      {displayIcon && <ErrorIcon />}
      <p {...rest} />
    </div>
  );
}
