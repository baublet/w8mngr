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
    <div className="rounded flex gap-4 opacity-50 hover:opacity-100">
      <div className="font-thin">Popular:</div>
      <div className="flex gap-2 flex-wrap items-center text-xs">
        {data.currentUser?.popularActivities.map((activity) => (
          <Link to={`/activities/${activity.id}`} key={activity.id}>
            {activity.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
