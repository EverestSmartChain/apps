// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:ENCL-1.0(https://github.com/evmos/apps/blob/main/LICENSE)

import { ComponentProps } from "react";

export function Label({ ...rest }: ComponentProps<"label">) {
  return (
    <label
      className="text-gray-300 text-xxs md:text-xs font-medium my-2 tracking-wider"
      {...rest}
    />
  );
}
