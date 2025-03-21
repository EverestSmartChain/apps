import { has, isObject } from "../assertions";

const isError = (error: unknown): error is Error => {
  return (
    error instanceof Error ||
    (isObject(error) && has(error, "message") && has(error, "stack"))
  );
};
export const normalizeError = (error: unknown) => {
  if (isError(error)) {
    return error;
  }
  if (typeof error === "string" || typeof error === "number") {
    return new Error(String(error));
  }
  return new Error(JSON.stringify(error));
};
