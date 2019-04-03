import { ActivityEntryType } from "../activityEntries/types";
import createActivityEntry from "../activityEntries/create";
import readActivity from "../activities/read";

import weightToGrams from "../../shared/transformers/activity/weightToGrams";
import findActivityEntries from "../activityEntries/findByUserIdActivityIdAndDay";

export async function activityEntriesResolver(
  _,
  {
    activity_id,
    day
  }: {
    activity_id: number;
    day: number;
  },
  context
): Promise<Array<ActivityEntryType> | false> {
  const user = context.user;
  if (!user) {
    return false;
  }

  const activity = await readActivity(activity_id, user.id);

  if (!activity) {
    return false;
  }

  return await findActivityEntries(user.id, activity_id, day);
}

export async function createActivityEntryResolver(
  _,
  {
    activity_id,
    day,
    reps,
    work,
    routine_id = null
  }: {
    activity_id: number;
    day: number;
    reps: number;
    work: string;
    routine_id: number | null;
  },
  context
): Promise<ActivityEntryType | false> {
  const user = context.user;
  if (!user) {
    return false;
  }

  const activity = await readActivity(activity_id, user.id);

  let calculatedWork = 0;

  switch (activity.activity_type) {
    case 0:
      calculatedWork = await weightToGrams(work);
      break;
  }

  const newEntry = await createActivityEntry(
    user.id,
    activity_id,
    day,
    reps,
    calculatedWork,
    routine_id
  );
  return newEntry;
}
