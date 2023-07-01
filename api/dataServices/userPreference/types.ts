import { InsertableDatabaseRecord, Database } from "../../config/db";

export type UserPreferenceEntity = InsertableDatabaseRecord<Database["userPreference"]>;

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
