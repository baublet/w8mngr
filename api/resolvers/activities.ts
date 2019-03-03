import { ActivityType } from "../activities/types";
import findActivitiesByUserId from "../activities/findByUserId";
import createActivity from "../activities/create";
import updateActivity from "../activities/update";
import deleteActivity from "../activities/delete";
import readActivity from "../activities/read";

export async function readActivitiesResolver(
  _,
  __,
  context
): Promise<Array<ActivityType> | boolean> {
  const user = context.user;
  if (!user) {
    return [];
  }
  return (await findActivitiesByUserId(user.id)) || [];
}

export async function readActivityResolver(
  _,
  { id, userId },
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
