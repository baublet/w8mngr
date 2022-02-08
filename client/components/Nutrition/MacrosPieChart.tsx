import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const COLORS = ["#f59e0b", "#be185d", "#84cc16"];

export type MacrosPieChartProps = {
  averageDailyFat: number;
  averageDailyCarbs: number;
  averageDailyProtein: number;
};

export function MacrosPieChart({
  averageDailyCarbs,
  averageDailyFat,
  averageDailyProtein,
}: MacrosPieChartProps) {
  const data = React.useMemo(() => {
    return [
      { name: "Fat", value: Math.ceil(averageDailyFat) },
      { name: "Carbs", value: Math.ceil(averageDailyCarbs) },
      { name: "Protein", value: Math.ceil(averageDailyProtein) },
    ];
  }, [averageDailyFat, averageDailyCarbs, averageDailyProtein]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 text-sm text-slate-900 text-opacity-70">
        <div>
          <b style={{ color: "#f59e0b" }}>Fat: </b>
          {Math.ceil(averageDailyFat)}
          <span className="text-xs text-slate-900 text-opacity-40">g</span>
        </div>
        <div>
          <b style={{ color: "#be185d" }}>Carbs: </b>
          {Math.ceil(averageDailyCarbs)}
          <span className="text-xs text-slate-900 text-opacity-40">g</span>
        </div>
        <div>
          <b style={{ color: "#84cc16" }}>Protein: </b>
          {Math.ceil(averageDailyProtein)}
          <span className="text-xs text-slate-900 text-opacity-40">g</span>
        </div>
      </div>
      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer>
          <PieChart width={450} height={450}>
            <Pie
              dataKey="value"
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={"100%"}
              fill="#1e293b"
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="#FFF"
                  strokeWidth={2}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const RADIAN = Math.PI / 180;
function renderCustomizedLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  payload,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
  payload: { payload: { name: string; value: number } };
}) {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <>
      <text
        x={x - 15}
        y={y}
        fill="white"
        textAnchor={"start"}
        dominantBaseline="central"
        className="text-xs"
      >
        {payload.payload.name}
      </text>
      <text
        x={x - 15}
        y={y + 12}
        fill="white"
        textAnchor={"start"}
        dominantBaseline="central"
        className="text-xs"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    </>
  );
}
