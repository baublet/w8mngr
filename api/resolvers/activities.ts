import { ActivityType } from "../activities/types";
import findActivitiesByUserId from "../activities/findByUserId";
import createActivity from "../activities/create";
import updateActivity from "../activities/update";
import deleteActivity from "../activities/delete";
import readActivity from "../activities/read";
import searchActivities from "../activities/search";
import muscleGroupsToQuery from "../../shared/transformers/activity/muscleGroupsToQuery";

export async function readActivitiesResolver(
  _,
  { offset, limit, order_by, sort },
  context
): Promise<Array<ActivityType>> {
  const user = context.user;
  if (!user) {
    return [];
  }
  return (
    (await findActivitiesByUserId(user.id, order_by, sort, offset, limit)) || []
  );
}

export async function readActivityResolver(
  _,
  { id },
  context
): Promise<ActivityType | false> {
  const user = context.user;
  if (!user) {
    return false;
  }
  return await readActivity(id, user.id);
}

export async function createActivityResolver(
  _,
  {
    name,
    description,
    exrx = "",
    activity_type = 0,
    muscle_groups = "00000000000000",
    intensity = 0
  }: {
    name: string;
    description: string;
    exrx: string;
    activity_type: number;
    muscle_groups: string;
    intensity: number;
  },
  context
): Promise<ActivityType | false> {
  const user = context.user;
  if (!user) {
    return false;
  }
  const newEntry = await createActivity(
    user.id,
    name,
    description,
    exrx,
    activity_type,
    muscle_groups,
    intensity
  );
  return newEntry;
}

export async function updateActivityResolver(
  _,
  {
    id,
    name,
    description,
    exrx = "",
    activity_type = 0,
    muscle_groups = "00000000000000",
    intensity = 0
  }: {
    id: number;
    name: string;
    description: string;
    exrx: string;
    activity_type: number;
    muscle_groups: string;
    intensity: number;
  },
  context
): Promise<ActivityType | false> {
  const user = context.user;
  if (!user) {
    return false;
  }
  const newEntry = await updateActivity(
    id,
    user.id,
    name,
    description,
    exrx,
    activity_type,
    muscle_groups,
    intensity
  );
  return newEntry;
}

export async function deleteActvityResolver(
  _,
  { id },
  context
): Promise<boolean> {
  const user = context.user;
  if (!user) {
    return false;
  }
  return await deleteActivity(id, user.id);
}

export async function searchActivitiesResolver(
  _,
  { term, muscle_groups, offset, limit, order_by, sort },
  context
): Promise<Array<ActivityType>> {
  const user = context.user;
  if (!user) {
    return [];
  }

  term = term ? `%${term}%` : "%";
  const muscleGroups = muscleGroupsToQuery(muscle_groups);

  return await searchActivities(
    user.id,
    term,
    muscleGroups,
    order_by,
    sort,
    offset,
    limit
  );
}
