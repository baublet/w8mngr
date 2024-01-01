import addDays from "date-fns/addDays/index.js";
import addMonths from "date-fns/addMonths/index.js";
import format from "date-fns/format/index.js";
import subMonths from "date-fns/subMonths/index.js";
import groupBy from "lodash.groupby";

import { objectEntries } from "../../../shared/objectEntries.js";
import { dayStringFromDate } from "../../../shared/dayStringFromDate.js";
import { dayStringToDate } from "../../../shared/dayStringToDate.js";
import { Maybe } from "../../../shared/types.js";
import { Context } from "../../createContext.js";
import { FoodLogDataPoint } from "../../generated.js";
import { globalInMemoryCache } from "../../helpers/globalInMemoryCache.js";
import { rootService } from "./rootService.js";
import type { FoodLogEntity } from "./types.js";

export async function stats(
  context: Context,
  { userId, ...args }: { from?: Maybe<Date>; to?: Maybe<Date>; userId: string }
) {
  const { from, to } = getDateRangeWithDefault(args);
  const cacheKey = `food-log-stats-${userId}-${from}-${to}`;
  return globalInMemoryCache.getOrSet({
    key: cacheKey,
    expiry: Date.now() + 1000 * 60 * 2,
    fn: async () => {
      const foodLogsInRange = await rootService.findBy(context, (q) =>
        q
          .where("userId", "=", userId)
          .where("day", ">=", from)
          .where("day", "<=", to)
      );
      const foodLogsGroupedByDay: Record<string, FoodLogEntity[]> =
        groupBy<any>(foodLogsInRange, (log) => log.day);

      fillDays(foodLogsGroupedByDay, () => []);

      const days = objectEntries(foodLogsGroupedByDay);

      const averageDailyCaloriesMap: Record<string, number> = {};
      const averageDailyCarbsMap: Record<string, number> = {};
      const averageDailyFatMap: Record<string, number> = {};
      const averageDailyProteinMap: Record<string, number> = {};

      for (const [day, foodLogs] of days) {
        for (const foodLog of foodLogs) {
          maybeAddToTotal(averageDailyCaloriesMap, day, foodLog.calories);
          maybeAddToTotal(averageDailyCarbsMap, day, foodLog.carbs);
          maybeAddToTotal(averageDailyFatMap, day, foodLog.fat);
          maybeAddToTotal(averageDailyProteinMap, day, foodLog.protein);
        }
      }

      const averageDailyCalories = getFlattenedAverage(averageDailyCaloriesMap);
      const averageDailyCarbs = getFlattenedAverage(averageDailyCarbsMap);
      const averageDailyFat = getFlattenedAverage(averageDailyFatMap);
      const averageDailyProtein = getFlattenedAverage(averageDailyProteinMap);

      const visualizationData: FoodLogDataPoint[] = days.map(
        ([day, foodLogs]) => {
          return {
            day,
            ...foodLogs.reduce(
              (data, foodLog) => {
                data.calories = maybeAdd(data.calories, foodLog.calories);
                data.carbs = maybeAdd(data.carbs, foodLog.carbs);
                data.fat = maybeAdd(data.fat, foodLog.fat);
                data.protein = maybeAdd(data.protein, foodLog.protein);
                return data;
              },
              {
                calories: undefined,
                carbs: undefined,
                fat: undefined,
                protein: undefined,
              } as Omit<FoodLogDataPoint, "day">
            ),
            dayLabel: format(dayStringToDate(day), "PP"),
          };
        }
      );

      return {
        summary: {
          averageDailyCalories,
          averageDailyCarbs,
          averageDailyFat,
          averageDailyProtein,
          totalFoodsLogged: foodLogsInRange.length,
        },
        visualizationData: visualizationData.map((data, i) => ({
          day: data.day,
          dayLabel: format(dayStringToDate(data.day), "PP"),
          calories: data.calories,
          fat: data.fat,
          carbs: data.carbs,
          protein: data.protein,
        })),
      };
    },
  });
}

function orZero(value: any) {
  if (value === Infinity) {
    return 0;
  }
  if (isNaN(value)) {
    return 0;
  }
  if (typeof value === "string") {
    return parseInt(value, 10);
  }
  if (typeof value === "number") {
    return value;
  }
  return 0;
}

function maybeAdd(originalValue: undefined | number, value: any) {
  if (!originalValue) {
    return orZero(value);
  }
  return originalValue + orZero(value);
}

function maybeAddToTotal<T extends Record<any, any>>(
  subject: T,
  key: keyof T,
  value: any
) {
  const valueToAdd = orZero(parseInt(value, 10));
  const anySubject: any = subject;
  if (anySubject[key] === undefined) {
    anySubject[key] = valueToAdd;
  } else {
    anySubject[key] += valueToAdd;
  }
}

function getDateRangeWithDefault(args?: {
  from?: Maybe<Date>;
  to?: Maybe<Date>;
}) {
  let from = args?.from;
  let to = args?.to;

  if (!from && !to) {
    from = subMonths(new Date(), 3);
    to = new Date();
  } else if (!from && to) {
    from = subMonths(to, 3);
  } else if (from && !to) {
    to = addMonths(from, 3);
  }

  return {
    from: dayStringFromDate(from as Date),
    to: dayStringFromDate(to as Date),
  };
}

function getFlattenedAverage(set: Record<string, number>): number {
  const entries = objectEntries(set);
  let total = 0;
  let totalValues = 0;

  for (const [, value] of entries) {
    total += value;
    totalValues += 1;
  }

  if (totalValues === 0) {
    return 0;
  }

  const flattenedAverage = total / totalValues;

  if (isNaN(flattenedAverage)) {
    return 0;
  }

  if (flattenedAverage === Infinity) {
    return 0;
  }

  return flattenedAverage;
}

function fillDays<T>(record: Record<string, T>, fillEmptyDay: () => T) {
  const days = Object.keys(record).sort();
  const firstDay = days[0];
  const lastDay = days[days.length - 1];

  const firstDayDate = dayStringToDate(firstDay);

  let currentDay = firstDayDate;
  let currentDayString = firstDay;

  while (currentDayString !== lastDay) {
    currentDay = addDays(currentDay, 1);
    currentDayString = dayStringFromDate(currentDay);
    if (!record[currentDayString]) {
      record[currentDayString] = fillEmptyDay();
    }
  }
}
