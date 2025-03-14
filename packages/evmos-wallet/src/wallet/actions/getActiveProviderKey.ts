import { getAccount } from "wagmi/actions";
import { CONNECTOR_MAP } from "../wagmi";

export function getActiveProviderKey() {
  const { connector } = getAccount();
  const id = connector?.id ?? null;
  if (id && id in CONNECTOR_MAP) {
    return id as keyof typeof CONNECTOR_MAP;
  }
  return null;
}
