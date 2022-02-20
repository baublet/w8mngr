import type { UserPreferenceType } from "../../generated";

export type UserPreferenceValues = {
  BIRTHDAY: Date | undefined | null;
  DEFAULT_UNIT: "metric" | "imperial";
  FATURDAY_CALORIES: number;
  FATURDAY_FAT: number;
  FATURDAY_CARBS: number;
  FATURDAY_PROTEIN: number;
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
