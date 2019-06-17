import { ActivityType, ActivityTypeType } from "api/activities/types";
import weightToGrams from "./weightToGrams";
import timeToMs from "./timeToMs";
import distanceToMm from "./distanceToMm";

// Returns grams from an arbitrary string.
export default async function activityAndWorkToCalculated(
  activity: ActivityType,
  work: string
): Promise<number> {
  switch (activity.activity_type) {
    case ActivityTypeType.WEIGHTLIFTING:
      return await weightToGrams(work);
    case ActivityTypeType.TIMED:
      return await timeToMs(work);
    case ActivityTypeType.DISTANCE:
      return await distanceToMm(work);
  }
  return 0;
}
