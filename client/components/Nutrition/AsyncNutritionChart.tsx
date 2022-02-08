import React from "react";

import { LoadableComponent } from "../LoadableComponent";
import type { NutritionChartProps } from "./NutritionChart";

export function AsyncNutritionChart(props: NutritionChartProps) {
  return (
    <LoadableComponent
      load={() => import("./NutritionChart")}
      component="NutritionChart"
      props={props}
    />
  );
}
