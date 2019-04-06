import { ActivityType } from "api/activities/types";
import weightToGrams from "./weightToGrams";

// Returns grams from an arbitrary string.
export default async function activityAndWorkToCalculated(
  activity: ActivityType,
  work: string
): Promise<number> {
  switch (activity.activity_type) {
    case 0:
      return await weightToGrams(work);
  }
  return 0;
}
