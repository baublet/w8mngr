import format from "date-fns/format";
import parse from "date-fns/parse";
import subYears from "date-fns/subYears";

import { dayStringFromDate, dayStringToDate } from "../../../shared";
import { Context } from "../../createContext";
import { WeightLogSummary, WeightLogSummaryInput } from "../../generated";
import { numberToStringUnit } from "../../helpers/numberToStringUnit";
import { settingsService } from "../../helpers/settingsService";
import { rootService } from "./rootService";

export async function getVisualizationData(
  context: Context,
  {
    userId,
    input = {},
  }: {
    userId: string;
    input?: WeightLogSummaryInput;
  }
): Promise<WeightLogSummary> {
  const latestWeight = await rootService.findOneBy(context, (q) =>
    q.where("userId", "=", userId).orderBy("day", "desc")
  );

  // If they have no "latest" value here, we can't do anything because the user
  // hasn't entered any data yet.
  if (!latestWeight) {
    return {};
  }

  const settings = await context.services.get(settingsService);
  const parseStringToDate = (d: any) => parse(d, "yyyyMMdd", new Date());

  const fromDate = !input.from
    ? subYears(new Date(), 1)
    : parseStringToDate(input.from);
  const toDate = !input.to ? new Date() : parseStringToDate(input.to);

  const from = dayStringFromDate(fromDate);
  const to = dayStringFromDate(toDate);

  const currentWeightLabel = numberToStringUnit({
    work: latestWeight.weight,
    incomingUnit: "GRAMS",
    outgoingUnits: settings.defaultMassMeasurement,
  });

  const entries = await rootService.findBy(context, (q) =>
    q
      .where("userId", "=", userId)
      .where("day", ">=", from)
      .where("day", "<=", to)
  );

  if (entries.length === 0) {
    return {
      currentWeightLabel,
      currentWeight: latestWeight.weight,
    };
  }

  return {
    currentWeightLabel,
    currentWeight: latestWeight.weight,
    dailyAverage: entries.map((entry) => ({
      day: entry.day,
      dayLabel: format(dayStringToDate(entry.day), "PP"),
      weight: entry.weight,
      weightLabel: numberToStringUnit({
        work: entry.weight,
        incomingUnit: "GRAMS",
        outgoingUnits: settings.defaultMassMeasurement,
      }),
    })),
  };
}
