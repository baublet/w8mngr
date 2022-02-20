import type { UserPreferenceType } from "../../generated";

export type UserPreferenceValues = {
  BIRTHDAY: Date | undefined | null;
  DEFAULT_UNIT: "metric" | "imperial";
  FATURDAY_CALORIES: number | null;
  FATURDAY_FAT: number | null;
  FATURDAY_CARBS: number | null;
  FATURDAY_PROTEIN: number | null;
  FATURDAYS: boolean;
  HEIGHT: string | undefined | null;
};

export const userPreferenceTypes = [
  "BIRTHDAY",
  "DEFAULT_UNIT",
  "FATURDAY_CALORIES",
  "FATURDAY_FAT",
  "FATURDAY_CARBS",
  "FATURDAY_PROTEIN",
  "FATURDAYS",
  "HEIGHT",
] as const;

export type UserPreferenceEntity = {
  id: string;
  userId: string;
  preference: UserPreferenceType;
  value: string;
  createdAt: Date;
  updatedAt: Date;
};
