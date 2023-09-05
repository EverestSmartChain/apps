import { ComponentProps, useState, useEffect } from "react";
import { formatUnits, parseUnits } from "viem";
import { cn, clamp, E } from "helpers";
export const AmountInput = ({
  value,
  decimals,
  onChange,
  max,
  min = 0n,
  className,
  maxButtonClassName,
  ...props
}: Omit<ComponentProps<"input">, "value" | "onChange" | "max" | "min"> & {
  maxButtonClassName?: string;
  decimals?: number | string;
  onChange?: (value: bigint) => void;
  value?: bigint;
  max?: bigint;
  min?: bigint;
}) => {
  const decimalsUnit = parseInt(String(decimals ?? 18));
  const formattedValue = formatUnits(value ?? 0n, decimalsUnit);
  const [internalValueState, setValue] = useState(formattedValue);

  useEffect(() => {
    // amount = clamp(amount, min ?? 0n, max ?? amount);
    setValue((prev) => {
      const parsed = parseUnits(prev, decimalsUnit);
      const amount = clamp(parsed, min, max ?? parsed);
      return formatUnits(amount, decimalsUnit);
    });
  }, [max, min, decimalsUnit]);

  return (
    <div className="relative">
      <input
        value={internalValueState}
        className={cn(
          "w-full font-bold py-3 px-4 text-sm leading-5 text-gray-900 focus:ring-1 border rounded",
          className
        )}
        onChange={(e) => {
          if (e.target.value.split(".").length > 2) {
            return;
          }
          const [error, parsed] = E.try(() =>
            parseUnits(e.target.value, decimalsUnit)
          );

          if (error) {
            return;
          }
          let amount = parsed;
          if (max || min) {
            amount = clamp(amount, min ?? 0n, max ?? amount);
          }
          setValue(e.target.value);
          if (amount !== value) {
            onChange?.(amount);
          }
        }}
        onBlur={() => {
          const normalizedValue = formatUnits(value ?? 0n, decimalsUnit);
          if (normalizedValue !== internalValueState) {
            setValue(normalizedValue);
          }
        }}
        inputMode="decimal"
        type="text"
        pattern="[0-9]*(.[0-9]+)?"
        role="spinbutton"
        autoComplete="off"
        autoCorrect="off"
        {...props}
      />

      <button
        className={cn(
          "absolute right-2 p-2 leading-none top-1/2 -translate-y-1/2 border",
          maxButtonClassName
        )}
        onClick={(e) => {
          e.preventDefault();
          setValue(formatUnits(max ?? 0n, decimalsUnit));
          onChange?.(max ?? 0n);
        }}
      >
        Max
      </button>
    </div>
  );
};
