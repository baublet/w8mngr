import React from "react";

import { LoadableComponent } from "../LoadableComponent";
import type { MacrosPieChartProps } from "./MacrosPieChart";

export function AsyncMacrosPieChart(props: MacrosPieChartProps) {
  return (
    <LoadableComponent
      load={() => import("./MacrosPieChart")}
      component="MacrosPieChart"
      props={props}
    />
  );
}
