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

  let incomingUnit: Unit = "G";
  let outgoingUnit: Unit = "LB";
  if (activityType === "DISTANCE") {
    outgoingUnit = settings.defaultDistanceMeasurement;
    incomingUnit = "MM";
  } else if (activityType === "TIMED") {
    outgoingUnit = settings.defaultTemporalMeasurement;
    incomingUnit = "SECONDS";
  } else if (activityType === "WEIGHT") {
    outgoingUnit = settings.defaultMassMeasurement;
    incomingUnit = "G";
  }

  if (requestedWorkUnit) {
    outgoingUnit = requestedWorkUnit;
  }

  return numberToStringUnit({ work, incomingUnit, outgoingUnit });
}