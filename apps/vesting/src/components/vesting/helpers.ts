import * as z from "zod";
import { Intervals, TimeWindow } from "../../internal/helpers/types";

export const getEndDate = (
  date: string | undefined,
  vestingDuration: string
) => {
  const duration = Number(vestingDuration?.split(" ")[0]);
  const year = Number(date?.split("-")[0]);
  if (!isNaN(duration) && !isNaN(year)) {
    const total = duration + year;
    const day = date?.split("-")[2];
    const month = date?.split("-")[1];
    const finalDate = month + "/" + day + "/" + total;
    const isSet = month === undefined ? false : true;
    return [isSet, finalDate];
  }
  return [false, ""];
};

const VESTING_ACCOUNT_NAME_LOCALSTORAGE = "VESTING_ACCOUNT_NAME";

export const setVestingAccountNameLocalstorage = (accountName: string) => {
  localStorage.setItem(VESTING_ACCOUNT_NAME_LOCALSTORAGE, accountName);
};

export const getVestingAccountNameLocalstorage = () => {
  return localStorage.getItem(VESTING_ACCOUNT_NAME_LOCALSTORAGE);
};

export enum PlansType {
  Team = "Team",
  Grantee = "Grantee",
  Custom = "Custom",
}

export const plans = [
  PlansType.Custom,
  PlansType.Team,
  PlansType.Grantee,
] as const;
export const duration = [TimeWindow["4-years"], TimeWindow["1-year"]] as const;
export const cliff = [
  TimeWindow["1-year"],
  TimeWindow["1-month"],
  TimeWindow["1-day"],
  TimeWindow["none"],
] as const;
export const schedule = [Intervals["month"], Intervals["quarter"]] as const;
export const lockup = [
  TimeWindow["none"],
  TimeWindow["1-year"],
  TimeWindow["1-month"],
] as const;

export const dummyProps = {
  available: "2000450.52",
};

export const schema = z.object({
  address: z
    .string()
    .min(1, { message: "Required" })
    .and(
      z
        .string()
        .refine(
          (value: string) =>
            value.startsWith("evmos") || value.startsWith("0x"),
          {
            message: "Address must start with 'evmos' or '0x'",
          }
        )
    ),
  accountName: z.string(),
  amount: z
    .number({ invalid_type_error: "Required" })
    .min(0)
    .max(Number(dummyProps.available)),
  planType: z.enum(plans),
  vestingDuration: z.enum(duration),
  vestingCliff: z.enum(cliff),
  vestingSchedule: z.enum(schedule),
  lockupDuration: z.enum(lockup),
  startDate: z.coerce.date(),
});

export const vestingSettingsConfig = {
  [PlansType.Team]: {
    duration: [TimeWindow["4-years"]],
    cliff: [TimeWindow["1-year"]],
    schedule: [Intervals.month],
    lockup: [TimeWindow["1-year"]],
    disabled: true,
  },
  [PlansType.Grantee]: {
    duration: [TimeWindow["1-year"]],
    cliff: [TimeWindow["1-day"]],
    schedule: [Intervals.month],
    lockup: [TimeWindow["1-year"]],
    disabled: true,
  },
  [PlansType.Custom]: {
    duration: [TimeWindow["4-years"], TimeWindow["1-year"]],
    cliff: [
      TimeWindow["none"],
      TimeWindow["1-year"],
      TimeWindow["1-month"],
      TimeWindow["1-day"],
    ],
    schedule: [Intervals.month, Intervals.quarter],
    lockup: [TimeWindow["none"], TimeWindow["1-year"], TimeWindow["1-month"]],
    disabled: false,
  },
};

export const DEFAULT_FORM_VALUES = {
  address: "",
  accountName: "",
  amount: "",
  planType: PlansType.Team,
  vestingDuration: TimeWindow["4-years"],
  vestingCliff: TimeWindow["1-year"],
  vestingSchedule: Intervals.month,
  lockupDuration: TimeWindow["1-year"],
  startDate: " ",
};

export interface VestingProps {
  accountAddress: string;
  funderAddress: string;
  isVesting: boolean;
}

export const isEthereumAddressValid = (address: string): boolean => {
  const ethereumAddressRegex = /^0x[0-9a-fA-F]{40}$/;
  return ethereumAddressRegex.test(address);
};

export const isEvmosAddressValid = (address: string): boolean => {
  // TODO: are evmos wallet always 44 characters ?
  const evmosAddressRegex = /^evmos[0-9a-zA-Z]{39}$/;
  return evmosAddressRegex.test(address);
};
