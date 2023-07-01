import React from "react";
import format from "date-fns/format";

import { dayStringToDate } from "../../../shared/dayStringToDate";
import { useGetActivitiesSummaryQuery } from "../../generated";
import { PrimaryLoader } from "../Loading/Primary";
import { TileMap } from "../TileMap";
import { Link } from "../Link";

export function ActivitiesTileMap() {
  const { data, loading } = useGetActivitiesSummaryQuery();

  if (loading) {
    return <PrimaryLoader />;
  }

  const tileMapData = data?.currentUser?.activitySummary;
  if (!tileMapData) {
    return null;
  }

  return (
    <TileMap
      data={tileMapData.map((data) => ({
        day: data.day,
        intensity: data.intensity,
        label: (
          <LabelDataFromString dataString={data.labelData} day={data.day} />
        ),
      }))}
    />
  );
}

function LabelDataFromString({
  dataString,
  day,
}: {
  dataString: string;
  day: string;
}) {
  const parsedActivities: { id: string; name: string }[] = React.useMemo(() => {
    try {
      return JSON.parse(dataString);
    } catch {
      return [];
    }
  }, []);

  if (!parsedActivities || parsedActivities.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="font-thin">
        {format(dayStringToDate(day), "cccc, PP")}
      </div>
      <ul className="flex flex-col gap-2">
        {parsedActivities.map((activity) => (
          <li key={activity.id}>
            <span className="opacity-50">&bull;&nbsp;</span>
            <Link
              to={`/activities/${activity.id}/log/${day}`}
              className="no-underline text-emerald-300 hover-text-emerald-400 hover:underline"
            >
              {activity.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
