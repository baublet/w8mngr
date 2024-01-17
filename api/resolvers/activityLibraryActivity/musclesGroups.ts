import { activityLibraryActivityMuscleDataService } from "../../dataServices/activityLibraryActivityMuscle/index.js";
import { ActivityLibraryActivityResolvers, Muscle } from "../../generated.js";

export const activityLibraryActivityMuscleGroups: ActivityLibraryActivityResolvers["muscleGroups"] =
  async (parent, args, context) => {
    const muscles = await activityLibraryActivityMuscleDataService.findBy(
      context,
      (q) => q.where("activityLibraryActivityId", "=", parent.id),
    );

    return muscles.map((muscle) => muscle.muscle as Muscle);
  };
