import React from "react";
import cx from "classnames";

import { BaseIconButtonProps, BaseIconButton } from "./BaseIcon";

type SystemOutlineProps = BaseIconButtonProps;

export function SystemGhostIconButton(props: SystemOutlineProps) {
  return (
    <BaseIconButton
      {...props}
      className={cx(
        "select-none p-3 rounded-full text-sm",
        "border border-transparent text-purple-500",
        "hover:bg-purple-500 hover:text-purple-50",
        "focus:text-purple-50 focus:bg-purple-500",
        props.className
      )}
    />
  );
}
