import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const COLORS = ["#be185d", "#f59e0b", "#84cc16"];

export function MacrosPieChart({
  averageDailyCarbs,
  averageDailyFat,
  averageDailyProtein,
}: {
  averageDailyFat: number;
  averageDailyCarbs: number;
  averageDailyProtein: number;
}) {
  const data = React.useMemo(() => {
    return [
      { name: "Carbs", value: Math.ceil(averageDailyCarbs) },
      { name: "Fat", value: Math.ceil(averageDailyFat) },
      { name: "Protein", value: Math.ceil(averageDailyProtein) },
    ];
  }, [averageDailyFat, averageDailyCarbs, averageDailyProtein]);

  return (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer>
        <PieChart width={200} height={200}>
          <Pie
            dataKey="value"
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
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
  console.log({ arguments });
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
