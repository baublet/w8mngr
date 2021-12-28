import React from "react";
import cx from "classnames";

import { BaseButton, BaseButtonProps } from "./Base";

export function GhostInvertedButton(props: BaseButtonProps) {
  return (
    <BaseButton
      {...props}
      className={cx(
        "bg-transparent",
        "p-3",
        "border border-transparent hover:border-slate-300",
        "text-slate-400 hover:text-slate-700 uppercase",
        "",
        props.className
      )}
    />
  );
}
