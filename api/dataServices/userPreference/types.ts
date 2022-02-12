import type {UserPreferenceType} from "../../generated"

export type UserPreferenceValues = {
  BIRTHDAY: Date | undefined | null;
  DEFAULT_UNIT: "metric" | "imperial";
  FATURDAY_CALORIES: number;
  FATURDAYS: boolean;
  HEIGHT: string | undefined | null;
};

export const userPreferenceTypes= [
  "BIRTHDAY",
  "DEFAULT_UNIT",
  "FATURDAY_CALORIES",
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
