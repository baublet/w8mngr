import { activityDataService } from "../../dataServices/activity/index.js";
import { activityLibraryActivityMuscleDataService } from "../../dataServices/activityLibraryActivityMuscle/index.js";
import { activityMuscleDataService } from "../../dataServices/activityMuscle/index.js";
import { ActivityResolvers, Muscle } from "../../generated.js";

export const activityMuscleGroups: ActivityResolvers["muscleGroups"] = async (
  parent,
  args,
  context,
) => {
  const activity = await activityDataService.findOneOrFail(context, parent.id);
  if (activity.activityLibraryId) {
    const [muscles, libraryMuscles] = await Promise.all([
      activityMuscleDataService.findBy(context, (q) =>
        q.where("activityId", "=", parent.id),
      ),
      await activityLibraryActivityMuscleDataService.findBy(context, (q) =>
        q.where("activityLibraryActivityId", "=", activity.activityLibraryId),
      ),
    ]);

    // If they're the same, use the library muscles. If they're different,
    // defer to the user's stored data.
    const userMusclesString = muscles
      .map((muscle) => muscle.muscle as Muscle)
      .sort()
      .join("");
    const libraryMusclesString = libraryMuscles
      .map((muscle) => muscle.muscle as Muscle)
      .sort()
      .join("");
    if (userMusclesString === libraryMusclesString) {
      return libraryMuscles.map((muscle) => muscle.muscle as Muscle);
    } else {
      return muscles.map((muscle) => muscle.muscle as Muscle);
    }
  }

  const muscles = await activityMuscleDataService.findBy(context, (q) =>
    q.where("activityId", "=", parent.id),
  );

  return muscles.map((muscle) => muscle.muscle as Muscle);
};
