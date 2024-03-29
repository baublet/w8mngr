import { ActivityType } from "../generated";

export function activityTypeToHumanReadable(type: ActivityType) {
  switch (type) {
    case "DISTANCE":
      return "Distance exercise";
    case "REPETITIVE":
      return "Repetition-based exercise";
    case "TIMED":
      return "Timed exercise";
  }
  return "Weight-based repetition exercise";
}
