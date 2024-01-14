import cx from "classnames";
import React from "react";

import { BaseButton, BaseButtonProps } from "./Base";

export type GhostInvertedButtonProps = BaseButtonProps;

export function GhostInvertedButton(props: GhostInvertedButtonProps) {
  return (
    <BaseButton
      {...props}
      className={cx(
        "bg-slate-50 bg-opacity-5 hover:bg-opacity-10",
        "border border-slate-400 hover:border-slate-100",
        "text-slate-200 hover:text-slate-50 uppercase",
        props.className,
      )}
    />
  );
}
