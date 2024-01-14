import React from "react";
import format from "date-fns/format";

import { dayStringToDate } from "../../../shared/dayStringToDate";
import { ActivityType } from "../../generated";
import { TileMap } from "../TileMap";

export function ActivityTileMap({
  data,
  activityType,
  activityId,
}: {
  data: {
    day: string;
    reps: number;
    work: number;
    workLabel: string;
  }[];
  activityId: string;
  activityType: ActivityType;
}) {
  const transformedData: {
    day: string;
    label: React.ReactNode;
    // 1-10
    intensity: number;
    link: string;
  }[] = React.useMemo(() => {
    const groupedByDay = data.reduce(
      (acc, dataPoint) => {
        if (!acc[dataPoint.day]) {
          acc[dataPoint.day] = [];
        }
        acc[dataPoint.day].push(dataPoint);
        return acc;
      },
      {} as Record<string, { reps: number; work: number; workLabel: string }[]>,
    );

    const dataToRender: {
      day: string;
      label: React.ReactNode;
      // 1-10
      intensity: number;
      link: string;
    }[] = [];

    for (const [day, dataPoints] of Object.entries(groupedByDay)) {
      const intensity = clamp(dataPoints.length);
      const label = (
        <div className="flex flex-col gap-2">
          <b>{format(dayStringToDate(day), "cccc, PP")}</b>
          <ul>
            {dataPoints.map((point, i) => (
              <li key={i}>{logText({ point, activityType })}</li>
            ))}
          </ul>
        </div>
      );
      dataToRender.push({
        day,
        intensity,
        label,
        link: `/activities/${activityId}/log/${day}`,
      });
    }

    return dataToRender;
  }, [data]);

  if (transformedData.length === 0) {
    return null;
  }

  return <TileMap data={transformedData} />;
}

function clamp(value: number, min: number = 1, max: number = 10) {
  return Math.min(Math.max(value, min), max);
}

function logText({
  point: { reps, workLabel },
  activityType,
}: {
  point: {
    workLabel?: string;
    reps?: number;
  };
  activityType: ActivityType;
}) {
  switch (activityType) {
    case "DISTANCE":
    case "TIMED":
      return workLabel;
    case "REPETITIVE":
      return <>{reps}&nbsp;reps</>;
    case "WEIGHT":
      return (
        <div className="flex gap-2">
          <div className="w-2/12 text-right">{reps}</div>
          <div className="w-1/12 text-center">&times;</div>
          <div className="w-9/12">{workLabel}</div>
        </div>
      );
  }
}
