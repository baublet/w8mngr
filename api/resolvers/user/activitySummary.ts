import {
  ActivityLog,
  activityLogDataService,
  activityDataService,
  Activity,
} from "../../dataServices";
import { getDateRangeWithDefault } from "../../helpers";

import { UserResolvers } from "../../graphql-types";
import { dedupe, filterOutErrors, weightedClamp } from "../../../shared";

export const userActivitySummary: UserResolvers["activitySummary"] = async (
  parent,
  args,
  context
) => {
  const { from, to } = getDateRangeWithDefault(args.input);
  const activities = await activityLogDataService.findBy(context, (q) =>
    q
      .where("userId", "=", parent.id)
      .where("day", ">=", from)
      .where("day", "<=", to)
  );

  const groupedByDays: Record<string, ActivityLog[]> = activities.reduce(
    (map, value) => {
      if (!map[value.day]) {
        map[value.day] = [];
      }

      map[value.day].push(value);
      return map;
    },
    {} as Record<string, ActivityLog[]>
  );
  const dayCounts = Object.keys(groupedByDays).reduce((map, day) => {
    if (!map[day]) {
      map[day] = 0;
    }
    map[day] += groupedByDays[day].length;
    return map;
  }, {} as Record<string, number>);
  const setMax = Object.keys(dayCounts).reduce((map, day) => {
    if (!dayCounts[day]) {
      dayCounts[day] = 0;
    }
    dayCounts[day] = Math.max(dayCounts[day], dayCounts[day]);
    return map;
  }, 10);

  const activityIds: string[] = [];
  for (const activity of Object.values(groupedByDays)) {
    activityIds.push(...activity.map((a) => a.activityId));
  }
  const relatedActivityIds = dedupe(activityIds);
  const activityLoader = await activityDataService.getLoader(context);
  const relatedActivities = await activityLoader.loadMany(relatedActivityIds);
  const activityMap = filterOutErrors(relatedActivities).reduce(
    (map, value) => {
      map[value.id] = {
        id: value.id,
        name: value.name,
      };
      return map;
    },
    {} as Record<string, Pick<Activity, "id" | "name">>
  );

  return Object.keys(groupedByDays).map((day) => {
    return {
      day,
      labelData: JSON.stringify(
        dedupe(groupedByDays[day].map((a) => a.activityId)).map(
          (id) => activityMap[id]
        )
      ),
      intensity: weightedClamp({
        max: 10,
        min: 1,
        setMax,
        setValue: groupedByDays[day].length,
      }),
    };
  });
};
