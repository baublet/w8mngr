import { ActivityEntryType } from "../activityEntries/types";
import createActivityEntry from "../activityEntries/create";
import readActivity from "../activities/read";

import findActivityEntries from "../activityEntries/findByUserIdActivityIdAndDay";
import readActivityEntry from "../activityEntries/read";
import updateActivityEntry from "api/activityEntries/update";
import activityAndWorkToCalculated from "shared/transformers/activity/activityAndWorkToCalculated";
import deleteActivityEntry from "api/activityEntries/delete";

export async function activityEntriesResolver(
  _,
  {
    activityId,
    day
  }: {
    activityId: number;
    day: number;
  },
  context
): Promise<Array<ActivityEntryType> | false> {
  const user = context.user;
  if (!user) {
    return false;
  }

  const activity = await readActivity(activityId, user.id);
  if (!activity) {
    return false;
  }

  return await findActivityEntries(user.id, activityId, day);
}

export async function createActivityEntryResolver(
  _,
  {
    activityId,
    day,
    reps,
    work,
    routineId = null
  }: {
    activityId: number;
    day: number;
    reps: number;
    work: string;
    routineId: number | null;
  },
  context
): Promise<ActivityEntryType | false> {
  const user = context.user;
  if (!user) {
    return false;
  }
  const activity = await readActivity(activityId, user.id),
    calculatedWork = await activityAndWorkToCalculated(activity, work);

  const newEntry = await createActivityEntry(
    user.id,
    activityId,
    day,
    reps,
    calculatedWork,
    routineId
  );
  return newEntry;
}

export async function updateActivityEntryResolver(
  _,
  {
    id,
    reps,
    work
  }: {
    id: number;
    reps: number;
    work: string;
  },
  context
): Promise<ActivityEntryType | false> {
  const user = context.user;
  if (!user) {
    return false;
  }
  const activityEntry = await readActivityEntry(id),
    activity = await readActivity(activityEntry.activity_id, user.id),
    calculatedWork = await activityAndWorkToCalculated(activity, work);

  return await updateActivityEntry(id, user.id, reps, calculatedWork);
}

export async function deleteActivityEntryResolver(
  _,
  {
    id
  }: {
    id: number;
  },
  context
): Promise<boolean> {
  const user = context.user;
  if (!user) {
    return false;
  }

  return await deleteActivityEntry(id, user.id);
}
