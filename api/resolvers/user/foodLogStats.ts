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
  getMovingAverage,
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

  const visualizationData: FoodLogDataPoint[] = days.map(([day, foodLogs]) => {
    return {
      day: format(dayStringToDate(day), "PP"),
      ...foodLogs.reduce(
        (data, foodLog, i) => {
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
    };
  });

  const span = 7;
  const movingAverageCalories = getMovingAverage(
    visualizationData.map((d) => d.calories),
    { span }
  );
  const movingAverageFat = getMovingAverage(
    visualizationData.map((d) => d.fat),
    { span }
  );
  const movingAverageCarbs = getMovingAverage(
    visualizationData.map((d) => d.carbs),
    { span }
  );
  const movingAverageProtein = getMovingAverage(
    visualizationData.map((d) => d.protein),
    { span }
  );
  const movingAverageDays = movingAverageProtein.map((d, i) => {
    const visDataIndex = i * span;
    if (visDataIndex > visualizationData.length) {
      return visualizationData[visualizationData.length - 1].day;
    }
    return visualizationData[visDataIndex].day;
  });

  return {
    summary: {
      averageDailyCalories,
      averageDailyCarbs,
      averageDailyFat,
      averageDailyProtein,
      totalFoodsLogged: foodLogsInRange.length,
    },
    visualizationData: movingAverageCalories.map((data, i) => ({
      day: movingAverageDays[i],
      calories: movingAverageCalories[i],
      fat: movingAverageFat[i],
      carbs: movingAverageCarbs[i],
      protein: movingAverageProtein[i],
    })),
  };
};

function orZero(value: any) {
  return value || 0;
}

function maybeAddToTotal<T extends Record<any, any>>(
  subject: T,
  key: keyof T,
  value: any
) {
  const anySubject: any = subject;
  if (anySubject[key] === undefined) {
    anySubject[key] = value;
  } else {
    anySubject[key] += value;
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

function getFlattenedAverage(set: Record<string, number>): number {
  const entries = objectEntries(set);
  let total = 0;
  let totalValues = 0;

  for (const [, value] of entries) {
    total += value;
    totalValues += 1;
  }

  return total / totalValues;
}
