import { Maybe } from "../../shared/types.js";
import { Context } from "../createContext.js";
import { ActivityType, Unit } from "../generated.js";
import { numberToStringUnit } from "./numberToStringUnit.js";
import { settingsService } from "./settingsService.js";

export async function numberToContextualUnit(
  context: Context,
  {
    work,
    activityType,
    requestedWorkUnit,
  }: {
    work: Maybe<number> | undefined;
    activityType: ActivityType;
    requestedWorkUnit?: Maybe<Unit>;
  },
): Promise<string> {
  if (!work) {
    return `${work === undefined ? "" : work}`;
  }

  const settings = await context.services.get(settingsService);

  let incomingUnit: Unit = "GRAMS";
  let outgoingUnits: Unit[] = ["LBS"];
  if (activityType === "DISTANCE") {
    outgoingUnits = settings.defaultDistanceMeasurement;
    incomingUnit = "MILLIMETERS";
  } else if (activityType === "TIMED") {
    outgoingUnits = settings.defaultTemporalMeasurement;
    incomingUnit = "SECONDS";
  } else if (activityType === "WEIGHT") {
    outgoingUnits = settings.defaultMassMeasurement;
    incomingUnit = "GRAMS";
  }

  if (requestedWorkUnit) {
    outgoingUnits = [requestedWorkUnit];
  }

  return numberToStringUnit({ context, work, incomingUnit, outgoingUnits });
}
