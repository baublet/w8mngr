import subYears from "date-fns/subYears";
import addYears from "date-fns/addYears";
import format from "date-fns/format";
import groupBy from "lodash.groupby";

import { foodLogDataService } from "../../dataServices/foodLog";
import { UserResolvers, FoodLogDataPoint } from "../../graphql-types";
import {
  dayStringFromDate,
  objectEntries,
  dayStringToDate,
} from "../../../shared";

const DATA_POINTS = ["calories", "fat", "carbs", "protein"] as const;
type FoodLogDataPointLabels = typeof DATA_POINTS[number];

const DATA_POINT_LABELS: Record<FoodLogDataPointLabels, string> = {
  calories: "Calories",
  fat: "Fat",
  carbs: "Carbs",
  protein: "Protein",
};

export const userFoodLogStats: UserResolvers["foodLogStats"] = async (
  parent,
  args,
  context
) => {
  const userId = parent.id;

  const { from, to } = getDateRangeWithDefault(args);

  const foodLogsInRange = await foodLogDataService.findBy(context, (q) =>
    q
      .where("userId", "=", userId)
      .andWhere("day", ">=", from)
      .andWhere("day", "<=", to)
  );
  const foodLogsGroupedByDay = groupBy(foodLogsInRange, (log) => log.day);
  const days = objectEntries(foodLogsGroupedByDay);

  const averageDailyCaloriesMap: Record<string, number> = {};
  const averageDailyCarbsMap: Record<string, number> = {};
  const averageDailyFatMap: Record<string, number> = {};
  const averageDailyProteinMap: Record<string, number> = {};

  const dataMap: Record<FoodLogDataPointLabels, Record<string, number>> = {
    calories: averageDailyCaloriesMap,
    carbs: averageDailyCarbsMap,
    fat: averageDailyFatMap,
    protein: averageDailyProteinMap,
  };

  for (const [day, foodLogs] of days) {
    for (const foodLog of foodLogs) {
      maybeAddToAverage(averageDailyCaloriesMap, day, foodLog.calories);
      maybeAddToAverage(averageDailyCarbsMap, day, foodLog.carbs);
      maybeAddToAverage(averageDailyFatMap, day, foodLog.fat);
      maybeAddToAverage(averageDailyProteinMap, day, foodLog.protein);
    }
  }

  let averageDailyCalories = 0;
  let averageDailyCarbs = 0;
  let averageDailyFat = 0;
  let averageDailyProtein = 0;

  for (const [day] of days) {
    averageDailyCalories +=
      (averageDailyCalories + averageDailyCaloriesMap[day]) / 2;
    averageDailyCarbs += (averageDailyCarbs + averageDailyCarbsMap[day]) / 2;
    averageDailyFat += (averageDailyFat + averageDailyFatMap[day]) / 2;
    averageDailyProtein +=
      (averageDailyProtein + averageDailyProteinMap[day]) / 2;
  }

  const visualizationData: FoodLogDataPoint[] = days.map(([day, foodLogs]) => {
    return {
      day: format(dayStringToDate(day), "PP"),
      ...foodLogs.reduce(
        (data, foodLog) => {
          data.calories += orZero(foodLog.calories);
          data.carbs += orZero(foodLog.carbs);
          data.fat += orZero(foodLog.fat);
          data.protein += orZero(foodLog.protein);
          return data;
        },
        {
          calories: 0,
          carbs: 0,
          fat: 0,
          protein: 0,
        } as Omit<FoodLogDataPoint, "day">
      ),
      calories: orZero(averageDailyCaloriesMap[day]),
      carbs: orZero(averageDailyCarbsMap[day]),
      fat: orZero(averageDailyFatMap[day]),
      protein: orZero(averageDailyProteinMap[day]),
    };
  });

  return {
    summary: {
      averageDailyCalories,
      averageDailyCarbs,
      averageDailyFat,
      averageDailyProtein,
      totalFoodsLogged: foodLogsInRange.length,
    },
    visualizationData,
  };
};

function orZero(value: any) {
  return value || 0;
}

function maybeAddToAverage<T extends Record<any, any>>(
  subject: T,
  key: keyof T,
  value: any
) {
  const anySubject: any = subject;
  if (anySubject[key] === undefined) {
    anySubject[key] = value;
  } else {
    anySubject[key] = (anySubject[key] + value) / 2;
  }
}

function getDateRangeWithDefault(args?: {
  from?: Maybe<Date>;
  to?: Maybe<Date>;
}) {
  let from = args?.from;
  let to = args?.to;

  if (!from && !to) {
    from = subYears(new Date(), 1);
    to = new Date();
  } else if (!from && to) {
    from = subYears(to, 1);
  } else if (from && !to) {
    to = addYears(from, 1);
  }

  return {
    from: dayStringFromDate(from as Date),
    to: dayStringFromDate(to as Date),
  };
}
