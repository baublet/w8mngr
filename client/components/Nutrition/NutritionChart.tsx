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

import {
  FoodLogDataPoint,
  WeightLogVisualizationDataPoint,
} from "../../generated";
import { useNavigateToUrl } from "../../helpers/useNavigateToUrl";

export type NutritionChartProps = {
  data: FoodLogDataPoint[];
  weightData: WeightLogVisualizationDataPoint[];
  summary: {
    totalFoodsLogged: number;
    averageDailyCalories: number;
    averageDailyFat: number;
    averageDailyCarbs: number;
    averageDailyProtein: number;
  };
};

export function NutritionChart({
  data,
  summary,
  weightData,
}: NutritionChartProps) {
  const navigate = useNavigateToUrl();
  const getNearestWeightPoint = React.useCallback(
    (day: string) => {
      if (weightData.length === 0) {
        return undefined;
      }
      return weightData.find((point) => point.day >= day);
    },
    [weightData, data],
  );
  const transformedVisualizationData = React.useMemo(() => {
    return (
      data.map((dataPoint) => {
        const weightPoint = getNearestWeightPoint(dataPoint.day);
        const weightNumeric = weightPoint?.weight
          ? weightPoint.weight / 30
          : null;
        return {
          weight: weightNumeric,
          weightLabel: weightPoint?.weightLabel || null,
          day: dataPoint.day,
          dayLabel: dataPoint.dayLabel,
          calories: dataPoint.calories,
          fat: dataPoint.fat ? dataPoint.fat * 10 * 1.52 : null, // Scales for the macros to align with the values of calories
          carbs: dataPoint.carbs ? dataPoint.carbs * 10 : null,
          protein: dataPoint.protein ? dataPoint.protein * 10 : null,
        };
      }) || []
    );
  }, [data]);

  return (
    <div className="aspect-video text-xs flex w-full flex-col gap-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          width={500}
          height={300}
          data={transformedVisualizationData}
          onMouseUp={(event?: {
            activePayload?: { payload?: { day?: string } }[];
          }) => {
            const clickedDay = event?.activePayload?.[0]?.payload?.day;
            if (clickedDay) {
              navigate(`/foodlog/${clickedDay}`);
            }
          }}
        >
          <Legend align="center" verticalAlign="top" />
          <Tooltip content={<CustomTooltip />} />

          <XAxis
            dataKey="dayLabel"
            interval="preserveStartEnd"
            strokeWidth={1}
          />
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
            cursor="pointer"
          />
          <Bar
            dataKey="carbs"
            barSize={25}
            fill="#be185d"
            minPointSize={10}
            opacity={0.25}
            stackId="macros"
            cursor="pointer"
          />
          <Bar
            dataKey="protein"
            barSize={25}
            fill="#84cc16"
            minPointSize={10}
            opacity={0.25}
            stackId="macros"
            cursor="pointer"
          />

          <Line
            type="monotone"
            dataKey="calories"
            stroke="#e11d48"
            connectNulls
            dot={false}
            strokeWidth={2}
            cursor="pointer"
          />

          <Line
            type="monotone"
            dataKey="weight"
            stroke="#000000"
            connectNulls
            dot={false}
            strokeWidth={2}
            cursor="pointer"
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
  payload?: {
    value: number;
    name: string;
    payload?: { weightLabel?: string; dayLabel?: string };
  }[];
  label?: string;
}) {
  const caloriesNode = payload?.find(({ name }) => name === "calories");
  const carbsNode = payload?.find(({ name }) => name === "carbs");
  const fatNode = payload?.find(({ name }) => name === "fat");
  const proteinNode = payload?.find(({ name }) => name === "protein");
  const weightLabel = payload?.find(({ name }) => name === "weight");
  const dayLabel = payload?.[0]?.payload?.dayLabel;

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
        <div className="p-2 font-thin text-sm">{dayLabel || label}</div>
        <ValueLabel
          value={weightLabel?.payload?.weightLabel}
          colorClassName="text-slate-400"
          text="Weight"
        />
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
  value?: number | string;
  text: string;
  colorClassName: string;
  multiplier?: number;
}) {
  const stringValue = React.useMemo(() => {
    if (value === undefined) {
      return "n/a";
    }
    if (typeof value === "number") {
      return Math.ceil(value * multiplier).toLocaleString();
    }
    return value;
  }, [value]);
  return (
    <div className="text-xs px-2">
      <b className={colorClassName}>{text}:</b>
      &nbsp;
      {stringValue}
    </div>
  );
}
