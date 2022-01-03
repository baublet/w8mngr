import React from "react";
import cx from "classnames";

export function Ping({
  location = "tr",
  color = "primary",
  size = "base",
}: {
  location?: "tr";
  color?: "primary" | "secondary";
  size?: "base" | "3xl";
} = {}) {
  const baseSize = cx({
    "h-3 w-3": size === "base",
    "h-6 w-6": size === "3xl",
  });

  const className = cx("flex absolute", baseSize, {
    "top-0 right-0": location === "tr" && size === "base",
    "-top-2 -right-2": location === "tr" && size === "3xl",
  });

  const baseColor = cx({
    "bg-purple-500": color === "primary",
    "bg-emerald-500": color === "secondary",
  });

  return (
    <span className={className}>
      <span
        className={cx(
          "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
          baseColor
        )}
      ></span>
      <span
        className={cx("relative inline-flex rounded-full", baseColor, baseSize)}
      ></span>
    </span>
  );
}
