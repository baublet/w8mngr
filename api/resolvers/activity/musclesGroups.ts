import { activityMuscleDataService } from "../../dataServices/activityMuscle/index.js";
import { ActivityResolvers, Muscle } from "../../generated.js";

export const activityMuscleGroups: ActivityResolvers["muscleGroups"] = async (
  parent,
  args,
  context,
) => {
  const muscles = await activityMuscleDataService.findBy(context, (q) =>
    q.where("activityId", "=", parent.id),
  );

  return muscles.map((muscle) => muscle.muscle as Muscle);
};
