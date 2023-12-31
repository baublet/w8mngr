import { ActivityType } from "../generated.js";

export function activityTypeToHumanReadable(type: ActivityType): string {
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
