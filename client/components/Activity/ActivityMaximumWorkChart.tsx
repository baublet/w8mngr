import React from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import formatDate from "date-fns/format";

import { TrophyIcon } from "../Icons/Trophy";
import { dayStringToDate } from "../../../shared/dayStringToDate";

export function ActivityMaximumWorkChart({
  data,
}: {
  data: {
    day: string;
    work: number;
    workLabel: string;
  }[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart width={300} height={100} data={data}>
        <Line
          type="monotone"
          dataKey="work"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ display: "none" }}
          connectNulls
        />
        <Tooltip content={<CustomTooltip />} />
        <XAxis dataKey="day" hide />
        <YAxis
          dataKey="work"
          type="number"
          domain={["dataMin", "dataMax"]}
          hide
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { day: string; workLabel: string; work: number } }[];
}) {
  if (!active) {
    return null;
  }

  const payloadElement = payload?.[0]?.payload;

  if (!payloadElement) {
    return null;
  }

  const { day, workLabel } = payloadElement;
  const label = formatDate(dayStringToDate(day), "PP");

  return (
    <div className="rounded shadow-xl bg-slate-800 text-slate-50">
      <div className="flex flex-col gap-2 p-2 text-sm">
        <div className="font-thin">{label}</div>
        <div className="font-thin flex gap-2 items-center">
          <span className="text-slate-50 text-xs fill-emerald-500">
            <TrophyIcon />
          </span>
          <span className="font-bold">{workLabel}</span>
        </div>
      </div>
    </div>
  );
}
