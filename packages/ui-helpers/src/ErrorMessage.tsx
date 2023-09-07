// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:ENCL-1.0(https://github.com/evmos/apps/blob/main/LICENSE)

import { ComponentProps } from "react";

export function ErrorMessage({ ...rest }: ComponentProps<"p"> & {}) {
  return <p className="text-red-300 text-xs font-medium pl-4" {...rest} />;
}
