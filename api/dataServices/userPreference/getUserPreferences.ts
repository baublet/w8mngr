import { log } from "../../config/log";
import { Context } from "../../createContext";
import { UserPreference } from "../../generated";
import { getQuery } from "./query";
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
}: {
  entity: UserPreferenceEntity;
  defaultValue: T;
}): T {
  if (entity) {
    try {
      return JSON.parse(entity.value);
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
