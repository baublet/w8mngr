import React from "react";
import cx from "classnames";

interface SpacerProps {
  orientation?: "horizontal" | "vertical";
  size?: "xs" | "s" | "m" | "l" | "xl";
}

export function Spacer({
  orientation: o = "vertical",
  size: s = "m",
}: SpacerProps = {}) {
  return (
    <div
      className={cx(
        {
          "inline-block": o == "horizontal",
          block: o == "vertical",
        },
        {
          ["h-1"]: s == "xs" && o == "vertical",
          ["h-4"]: s == "s" && o == "vertical",
          ["h-8"]: s == "m" && o == "vertical",
          ["h-16"]: s == "l" && o == "vertical",
          ["h-32"]: s == "xl" && o == "vertical",
          ["w-1"]: s == "xs" && o == "horizontal",
          ["w-4"]: s == "s" && o == "horizontal",
          ["w-8"]: s == "m" && o == "horizontal",
          ["w-16"]: s == "l" && o == "horizontal",
          ["w-32"]: s == "xl" && o == "horizontal",
        },
      )}
    />
  );
}
