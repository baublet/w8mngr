import { activityMuscleDataService } from "../../dataServices";
import { ActivityResolvers } from "../../graphql-types";

export const activityMuscleGroups: ActivityResolvers["muscleGroups"] = async (
  parent,
  args,
  context
) => {
  const muscles = await activityMuscleDataService.findBy(context, (q) =>
    q.where("activityId", "=", parent.id)
  );

  return muscles.map((muscle) => muscle.muscle);
};
