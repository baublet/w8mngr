import React from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
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
    <div className="aspect-video">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart width={400} height={300} data={data}>
          <XAxis dataKey="day" interval="preserveStartEnd" strokeWidth={1} />
          <Legend />
          <Tooltip />
          <Line type="monotone" dataKey="calories" stroke="#10b981" />
          <Bar dataKey="carbs" barSize={15} fill="#34d399" />
          <Bar dataKey="fat" barSize={30} fill="#10b981" />
          <Bar dataKey="protein" barSize={15} fill="#059669" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
