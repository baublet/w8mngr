import React from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { useGetFoodLogStatsQuery, FoodLogDataPoint } from "../../generated";
import { PrimaryLoader } from "../Loading/Primary";

export function FoodLogStats() {
  const { data, loading } = useGetFoodLogStatsQuery({
    fetchPolicy: "cache-and-network",
  });
  const stats = data?.currentUser?.foodLogStats;

  if (loading || !stats) {
    return <PrimaryLoader />;
  }

  return <MacrosChart data={stats.visualizationData} />;
}

function MacrosChart({ data }: { data: FoodLogDataPoint[] }) {
  return (
    <div className="aspect-video text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" interval="preserveStartEnd" strokeWidth={1} />
          <Legend />
          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="calories"
            stroke="#0ea5e9"
            connectNulls
          />

          <Bar
            dataKey="fat"
            barSize={25}
            fill="#eab308"
            minPointSize={10}
          />
          <Bar
            dataKey="carbs"
            barSize={25}
            fill="#be185d"
            minPointSize={10}
          />
          <Bar
            dataKey="protein"
            barSize={25}
            fill="#84cc16"
            minPointSize={10}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
}) {
  const caloriesNode = payload?.find(({ name }) => name === "calories");
  const carbsNode = payload?.find(({ name }) => name === "carbs");
  const fatNode = payload?.find(({ name }) => name === "fat");
  const proteinNode = payload?.find(({ name }) => name === "protein");

  if (!active) {
    return null;
  }

  if (!payload) {
    return null;
  }

  if (!caloriesNode || !carbsNode || !fatNode || !proteinNode) {
    return null;
  }

  return (
    <div className="rounded shadow-xl bg-slate-800 text-slate-50">
      <div className="flex flex-col gap-2 pb-2">
        <div className="p-2 font-thin text-sm">{label}</div>
        <ValueLabel
          value={caloriesNode?.value}
          colorClassName="text-blue-400"
          text="Calories"
        />
        <ValueLabel
          value={fatNode?.value}
          colorClassName="text-yellow-500"
          text="Fat"
        />
        <ValueLabel
          value={carbsNode?.value}
          colorClassName="text-rose-500"
          text="Carbohydrates"
        />
        <ValueLabel
          value={proteinNode?.value}
          colorClassName="text-lime-500"
          text="Protein"
        />
      </div>
    </div>
  );
}

function ValueLabel({
  value,
  text,
  colorClassName,
}: {
  value?: number;
  text: string;
  colorClassName: string;
}) {
  const stringValue =
    value === undefined ? "n/a" : Math.ceil(value).toLocaleString();
  return (
    <div className="text-xs px-2">
      <b className={colorClassName}>{text}:</b>
      &nbsp;
      {stringValue}
    </div>
  );
}
