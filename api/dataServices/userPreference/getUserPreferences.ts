import format from "date-fns/format/index.js";

import { stringToNumberOr } from "../../../shared/stringToNumberOr.js";
import { assertIsTruthy } from "../../../shared/assertIsTruthy.js";
import { getUniqueId } from "../../../shared/getUniqueId.js";
import { log } from "../../config/log.js";
import { Database } from "../../config/db.js";
import { Context } from "../../createContext.js";
import { rootService } from "./rootService.js";
import { UserPreferenceValues, userPreferenceTypes } from "./types.js";

const defaultValues: UserPreferenceValues = {
  BIRTHDAY: null,
  DEFAULT_UNIT: "imperial",
  FATURDAY_CALORIES: 3000,
  FATURDAY_FAT: null,
  FATURDAY_CARBS: null,
  FATURDAY_PROTEIN: null,
  FATURDAYS: false,
  HEIGHT: null,
};

const preferenceSerializers: Record<
  keyof UserPreferenceValues,
  (inputValue: string) => any
> = {
  BIRTHDAY: (inputValue: string) => {
    try {
      return format(new Date(inputValue), "PP");
    } catch {
      return null;
    }
  },
  HEIGHT: (inputValue: string) => inputValue,
  DEFAULT_UNIT: (inputValue: string) =>
    inputValue === "metric" ? "metric" : "imperial",
  FATURDAY_CALORIES: (inputValue: string) =>
    stringToNumberOr(inputValue, defaultValues["FATURDAY_CALORIES"]),
  FATURDAY_FAT: (inputValue: string) =>
    stringToNumberOr(inputValue, defaultValues["FATURDAY_FAT"]),
  FATURDAY_CARBS: (inputValue: string) =>
    stringToNumberOr(inputValue, defaultValues["FATURDAY_CARBS"]),
  FATURDAY_PROTEIN: (inputValue: string) =>
    stringToNumberOr(inputValue, defaultValues["FATURDAY_PROTEIN"]),
  FATURDAYS: (inputValue: string) => inputValue === "true",
};

export async function getUserPreferences(
  context: Context,
  { userId }: { userId: string },
) {
  const preferences = await rootService.findBy(context, (q) =>
    q.where("userId", "=", userId),
  );
  const values = await Promise.all(
    userPreferenceTypes.map(async (type) => {
      let entity = preferences.find((p) => p.preference === type);
      if (!entity) {
        const created = await rootService.create(context, [
          {
            id: getUniqueId(),
            preference: type,
            userId,
            value: JSON.stringify(defaultValues[type]),
          },
        ]);
        entity = created[0];
      }

      assertIsTruthy(
        entity,
        "User preference entity not found and could not be created.",
      );

      const value = getPreferenceOrDefault({
        context,
        entity: entity as any,
        defaultValue: defaultValues[type],
        serializer: preferenceSerializers[type],
      });

      return {
        id: entity.id,
        key: entity.preference,
        value,
      };
    }),
  );

  return values;
}

function getPreferenceOrDefault<T>({
  entity,
  defaultValue,
  serializer,
  context,
}: {
  entity: Database["userPreference"];
  defaultValue: T;
  serializer: (value: string) => any;
  context: Context;
}): T {
  if (entity) {
    try {
      const parsedValue = JSON.parse(entity.value);
      if (parsedValue) {
        return serializer(parsedValue);
      }
    } catch (error) {
      log(context, "error", "Error parsing user preference", {
        error,
        entity,
      });
      throw error;
    }
  }
  return defaultValue;
}
