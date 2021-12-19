import React from "react";
import cx from "classnames";

import { FireIcon } from "../Icons/Fire";

const intensityClasses: Record<number, string> = {
  0: "text-green-500 opacity-25",
  1: "text-green-500 opacity-75",
  2: "text-green-500",
  3: "text-yellow-400 opacity-50",
  4: "text-yellow-400 opacity-75",
  5: "text-yellow-400",
  6: "text-amber-500 opacity-50",
  7: "text-amber-500 opacity-75",
  8: "text-amber-500",
  9: "text-red-500 opacity-75",
  10: "text-red-500",
};

const sizes = {
  tiny: "text-md",
  small: "text-4xl",
  medium: "text-8xl",
} as const;

export function IntensityScale({
  intensity,
  size = "medium",
}: {
  intensity: number;
  size?: keyof typeof sizes;
}) {
  return (
    <div
      className={cx(sizes[size], intensityClasses[intensity])}
      title={`Intensity: ${intensity}`}
    >
      <FireIcon />
    </div>
  );
}
