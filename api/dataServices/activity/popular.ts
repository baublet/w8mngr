import { Context } from "../../createContext";
import { ActivityEntity } from "./types";

export async function popular(context: Context): Promise<ActivityEntity[]> {
  const userId = context.getCurrentUserId(true);
  const activityLogQueryFactory = await getActivityLogQuery(context);
  const popularQuery = activityLogQueryFactory();
  const popularActivityIds: { activityId: string }[] = await popularQuery
    .select("activityId")
    .count("id", { as: "activityCount" })
    .where("userId", "=", userId)
    .andWhere("archived", "=", false)
    .groupBy("activityId")
    .orderBy("activityCount", "DESC")
    .limit(10);

  const activityQueryFactory = await getQuery(context);
  const activitiesQuery = activityQueryFactory();
  const activities = await activitiesQuery.select("*").whereIn(
    "id",
    popularActivityIds.map(({ activityId }) => activityId)
  );

  const activitiesToReturn: Activity[] = [];
  for (const activity of popularActivityIds) {
    const activityToReturn = activities.find(
      ({ id }) => id === activity.activityId
    );
    if (activityToReturn) {
      activitiesToReturn.push(activityToReturn);
    }
  }

  return activitiesToReturn;
}
