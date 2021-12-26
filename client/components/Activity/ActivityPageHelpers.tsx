import React from "react";

import { Link } from "../Link";

import { useGetPopularActivitiesQuery } from "../../generated";

export function ActivityPageHelpers() {
  const { data } = useGetPopularActivitiesQuery();

  if (!data) {
    return null;
  }

  const popularActivities = data.currentUser?.popularActivities || [];
  const shouldRender = popularActivities.length > 0;

  if (!shouldRender) {
    return null;
  }

  return (
    <div className="pb-4 pt-2 pl-4 border-l-8 border-emerald-100 rounded">
      <div className="font-thin">Popular Activities</div>
      <div className="flex gap-2 flex-wrap items-center">
        {data.currentUser?.popularActivities.map((activity) => (
          <Link
            to={`/activities/${activity.id}`}
            key={activity.id}
            className="text-xs"
          >
            {activity.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
