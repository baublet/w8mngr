import { Context } from "../createContext";
import { ActivityType, Unit } from "../graphql-types";
import { numberToStringUnit } from "./numberToStringUnit";
import { settingsService } from "./settingsService";

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
  }
): Promise<string> {
  if (!work) {
    return `${work === undefined ? "" : work}`;
  }

  const settings = context.services.get(settingsService)();

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

  return numberToStringUnit({ work, incomingUnit, outgoingUnits });
}
