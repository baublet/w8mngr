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
        "border border-transparent hover:border-gray-300",
        "text-gray-400 hover:text-gray-700 uppercase",
        "",
        props.className
      )}
    />
  );
}
