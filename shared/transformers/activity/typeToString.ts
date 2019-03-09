import activityTypes from "shared/data/activity/activityTypes";

export default function activityTypeToString(type: number): string {
  if (activityTypes[type]) {
    return activityTypes[type];
  }
  throw new Error(`Activity type out of range: ${type}`);
}
