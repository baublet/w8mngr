import { log } from "../../config/log";
import { Context } from "../../createContext";
import { UserPreference } from "../../generated";
import { rootService } from "./rootService";
import {
  UserPreferenceEntity,
  UserPreferenceValues,
  userPreferenceTypes,
} from "./types";

const defaultValues: UserPreferenceValues = {
  BIRTHDAY: null,
  DEFAULT_UNIT: "imperial",
  FATURDAY_CALORIES: 3000,
  FATURDAYS: false,
  HEIGHT: null,
};

const preferenceSerializers: Record<
  keyof UserPreferenceValues,
  (inputValue: string) => any
> = {
  BIRTHDAY: (inputValue: string) => {
    try {
      return new Date(inputValue);
    } catch {
      return null;
    }
  },
  HEIGHT: (inputValue: string) => inputValue,
  DEFAULT_UNIT: (inputValue: string) =>
    inputValue === "metric" ? "metric" : "imperial",
  FATURDAY_CALORIES: (inputValue: string) => {
    try {
      return parseInt(inputValue, 10);
    } catch {
      return defaultValues["FATURDAY_CALORIES"];
    }
  },
  FATURDAYS: (inputValue: string) => inputValue === "true",
};

export async function getUserPreferences(
  context: Context,
  { userId }: { userId: string }
): Promise<UserPreference[]> {
  const preferences = await rootService.findBy(context, (q) =>
    q.where("userId", "=", userId)
  );
  const values: UserPreference[] = await Promise.all(
    userPreferenceTypes.map(async (type) => {
      let entity = preferences.find((p) => p.preference === type);
      if (!entity) {
        entity = await rootService.create(context, {
          preference: type,
          userId,
          value: JSON.stringify(defaultValues[type]),
        });
      }

      const value = getPreferenceOrDefault({
        entity,
        defaultValue: defaultValues[type],
        serializer: preferenceSerializers[type],
      });

      return {
        id: entity.id,
        key: entity.preference,
        value,
      };
    })
  );

  return values;
}

function getPreferenceOrDefault<T>({
  entity,
  defaultValue,
  serializer,
}: {
  entity: UserPreferenceEntity;
  defaultValue: T;
  serializer: (value: string) => any;
}): T {
  if (entity) {
    try {
      const parsedValue = JSON.parse(entity.value);
      if (parsedValue) {
        return serializer(parsedValue);
      }
    } catch (error) {
      log("error", "Error parsing user preference", {
        error,
        entity,
      });
      throw error;
    }
  }
  return defaultValue;
}
