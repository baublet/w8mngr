import React from "react";

import { or } from "../../../shared/coalesce";
import { useGetPopularActivitiesQuery } from "../../generated";
import { Link } from "../Link";

export function ActivityPageHelpers() {
  const { data } = useGetPopularActivitiesQuery();

  if (!data) {
    return null;
  }

  const popularActivities = or(data.currentUser?.popularActivities, []);
  const shouldRender = popularActivities.length > 0;

  if (!shouldRender) {
    return null;
  }

  return (
    <div className="rounded flex gap-2 opacity-75 hover:opacity-100 flex-col">
      <div className="font-thin border-slate-200">Popular</div>
      <div className="flex gap-2 flex-wrap items-center text-sm">
        {data.currentUser?.popularActivities.map((activity) => (
          <Link
            to={
              activity.__typename === "Activity"
                ? `/activities/${activity.id}`
                : `/activity-library/${activity.id}`
            }
            key={activity.id}
            className="bg-emerald-500 text-slate-50 p-1 px-2 rounded hover:bg-emerald-700 focus:bg-emerald-700"
          >
            {activity.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
