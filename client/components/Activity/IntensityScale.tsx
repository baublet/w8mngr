import React from "react";
import cx from "classnames";

import { FireIcon } from "../Icons/Fire";
import { LeafIcon } from "../Icons/Leaf";

const intensityClasses: Record<number, string> = {
  0: "text-green-500 opacity-25",
  1: "text-green-500 opacity-75",
  2: "text-green-500 opacity-100",
  3: "text-yellow-500 opacity-50",
  4: "text-yellow-500 opacity-75",
  5: "text-yellow-500 opacity-100",
  6: "text-purple-500 opacity-50",
  7: "text-purple-500 opacity-75",
  8: "text-purple-500 opacity-100",
  9: "text-red-500 opacity-50",
  10: "text-red-500",
};

const sizes = {
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
    <div className={cx(sizes[size], intensityClasses[intensity])}>
      {intensity <= 5 ? (
        <LeafIcon />
      ) : (
        <FireIcon />
      )}
    </div>
  );
}
