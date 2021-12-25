import { activityDataService } from "../../dataServices";
import { ActivityLogResolvers, Unit } from "../../graphql-types";
import { workToUnit } from "../../../shared";
import { settingsService, numberToStringUnit } from "../../helpers";

export const activityLogWork: ActivityLogResolvers["work"] = async (
  parent,
  args,
  context
) => {
  const parentWork: number | undefined = parent.work as any;

  if (!parentWork) {
    return parentWork;
  }

  const requestedWorkUnit = args.unit;

  const activity = await activityDataService.findOneOrFail(context, (q) =>
    q.where("id", "=", parent.activityId)
  );

  const settings = context.services.get(settingsService)();

  let incomingUnit: Unit = "G";
  let outgoingUnit: Unit = "LB";
  if (activity.type === "DISTANCE") {
    outgoingUnit = settings.defaultDistanceMeasurement;
    incomingUnit = "MM";
  } else if (activity.type === "TIMED") {
    outgoingUnit = settings.defaultTemporalMeasurement;
    incomingUnit = "SECONDS";
  } else if (activity.type === "WEIGHT") {
    outgoingUnit = settings.defaultMassMeasurement;
    incomingUnit = "G";
  }

  if (requestedWorkUnit) {
    outgoingUnit = requestedWorkUnit;
  }

  return numberToStringUnit({ work: parentWork, incomingUnit, outgoingUnit });
};
