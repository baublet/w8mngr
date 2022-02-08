import cx from "classnames";
import React from "react";
import {
  Bar,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { FoodLogDataPoint } from "../../generated";

export type NutritionChartProps = {
  data: FoodLogDataPoint[];
  summary: {
    totalFoodsLogged: number;
    averageDailyCalories: number;
    averageDailyFat: number;
    averageDailyCarbs: number;
    averageDailyProtein: number;
  };
};

export function NutritionChart({ data, summary }: NutritionChartProps) {
  const transformedVisualizationData = React.useMemo(() => {
    return (
      data.map((dataPoint) => ({
        day: dataPoint.day,
        calories: dataPoint.calories,
        fat: dataPoint.fat ? dataPoint.fat * 10 * 1.52 : null, // Scales for the macros to align with the values of calories
        carbs: dataPoint.carbs ? dataPoint.carbs * 10 : null,
        protein: dataPoint.protein ? dataPoint.protein * 10 : null,
      })) || []
    );
  }, [data]);

  return (
    <div className="aspect-video text-xs flex w-full flex-col gap-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          width={500}
          height={300}
          data={transformedVisualizationData}
        >
          <Legend align="center" verticalAlign="top" />
          <Tooltip content={<CustomTooltip />} />

          <XAxis dataKey="day" interval="preserveStartEnd" strokeWidth={1} />
          <YAxis />

          <ReferenceLine
            stroke="#881337"
            y={summary.averageDailyCalories || 2000}
          />

          <Bar
            dataKey="fat"
            barSize={25}
            fill="#eab308"
            minPointSize={10}
            opacity={0.25}
            stackId="macros"
          />
          <Bar
            dataKey="carbs"
            barSize={25}
            fill="#be185d"
            minPointSize={10}
            opacity={0.25}
            stackId="macros"
          />
          <Bar
            dataKey="protein"
            barSize={25}
            fill="#84cc16"
            minPointSize={10}
            opacity={0.25}
            stackId="macros"
          />

          <Line
            type="monotone"
            dataKey="calories"
            stroke="#e11d48"
            connectNulls
            dot={false}
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="text-sm flex flex-wrap gap-2 w-2/3 mx-auto justify-center items-center">
        <b className="uppercase bold opacity-50">Averages</b>
        <SummaryLabel label="Calories" value={summary.averageDailyCalories} />
        <SummaryLabel label="Fat" value={summary.averageDailyFat} unit="g" />
        <SummaryLabel
          label="Carbs"
          value={summary.averageDailyCarbs}
          unit="g"
        />
        <SummaryLabel
          label="Protein"
          value={summary.averageDailyProtein}
          unit="g"
        />
      </div>
    </div>
  );
}

function SummaryLabel({
  label,
  value,
  unit,
}: {
  label: "Calories" | "Fat" | "Carbs" | "Protein";
  unit?: string;
  value: number;
}) {
  return (
    <div
      className={cx("flex gap-2 p-2 rounded uppercase text-slate-50", {
        "bg-rose-900 ": label === "Calories",
        "bg-amber-600": label === "Fat",
        "bg-pink-600": label === "Carbs",
        "bg-lime-500": label === "Protein",
      })}
    >
      <div className="opacity-75">{label}</div>
      <div>
        <span className="font-bold">{Math.ceil(value).toLocaleString()}</span>
        {unit && <span className="lowercase opacity-50">&nbsp;{unit}</span>}
      </div>
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
          multiplier={1 / (10 * 1.52)}
        />
        <ValueLabel
          value={carbsNode?.value}
          colorClassName="text-rose-500"
          text="Carbohydrates"
          multiplier={1 / 10}
        />
        <ValueLabel
          value={proteinNode?.value}
          colorClassName="text-lime-500"
          text="Protein"
          multiplier={1 / 10}
        />
      </div>
    </div>
  );
}

function ValueLabel({
  value,
  text,
  colorClassName,
  multiplier = 1,
}: {
  value?: number;
  text: string;
  colorClassName: string;
  multiplier?: number;
}) {
  const stringValue =
    value === undefined
      ? "n/a"
      : Math.ceil(value * multiplier).toLocaleString();
  return (
    <div className="text-xs px-2">
      <b className={colorClassName}>{text}:</b>
      &nbsp;
      {stringValue}
    </div>
  );
}
