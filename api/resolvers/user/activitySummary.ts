import format from "date-fns/format";
import { dayStringToDate } from "../../../shared/dayStringToDate";
import { dedupe } from "../../../shared/dedupe";
import { filterOutErrors } from "../../../shared/filterOutErrors";
import { weightedClamp } from "../../../shared/weightedClamp";

import {
  ActivityLog,
  activityLogDataService,
} from "../../dataServices/activityLog";
import { Activity, activityDataService } from "../../dataServices/activity";
import { UserResolvers } from "../../generated";
import { globalInMemoryCache } from "../../helpers/globalInMemoryCache";
import { getDateRangeWithDefault } from "../../helpers/getDateRangeWithDefault";

export const userActivitySummary: UserResolvers["activitySummary"] = async (
  parent,
  args,
  context
) => {
  const { from, to } = getDateRangeWithDefault(args.input);
  const cacheKey = `userActivitySummary-${parent.id}-${from}-${to}`;
  return globalInMemoryCache.getOrSet({
    key: cacheKey,
    expiry: Date.now() + 1000 * 60 * 60 * 12,
    fn: async () => {
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
      const relatedActivities = await activityDataService.findBy(context, (q) =>
        q.where("id", "in", relatedActivityIds)
      );
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
          dayLabel: format(dayStringToDate(day), "PP"),
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
    },
  });
};
