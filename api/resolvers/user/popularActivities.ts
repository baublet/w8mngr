import { activityDataService } from "../../dataServices/activity/index.js";
import { activityLibraryDataService } from "../../dataServices/activityLibrary/index.js";
import { UserResolvers, ActivityType } from "../../generated.js";
import { dedupeBy } from "../../../shared/dedupeBy.js";

export const userPopularActivities: UserResolvers["popularActivities"] = async (
  parent,
  args,
  context,
) => {
  const [popularUserActivities, popularLibraryActivities] = await Promise.all([
    activityDataService.popular(context),
    activityLibraryDataService.popular(context),
  ]);

  const popularActivities = dedupeBy(
    [
      ...popularUserActivities,
      ...popularLibraryActivities.map((a) => ({
        ...a,
        __typename: "ActivityLibraryActivity",
      })),
    ],
    "id",
  ).slice(0, 10);

  return popularActivities.map((a) => ({
    id: a.id,
    createdAt: a.createdAt || Date.now(),
    updatedAt: a.updatedAt || Date.now(),
    description: a.description || undefined,
    exrx: "exrx" in a ? (a.exrx ? String(a.exrx) : undefined) : undefined,
    intensity: a.intensity || 0,
    type: (a.type || "WEIGHT") as ActivityType,
    name: a.name,
    muscleGroups: [],
    stats: {},
  }));
};
