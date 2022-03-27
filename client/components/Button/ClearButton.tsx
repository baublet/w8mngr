import cx from "classnames";
import React from "react";

import { GhostButton, GhostButtonProps } from "./Ghost";

export function ClearButton(props: GhostButtonProps) {
  return (
    <GhostButton
      {...props}
      className={cx(
        `
        bg-transparent
        text-slate-700
        border
        border-slate-500
        text-xs
        hover:bg-slate-500
        focus:bg-slate-500
        hover:text-white
        focus:text-white
        rounded-full
      `,
        props.className
      )}
    />
  );
}
