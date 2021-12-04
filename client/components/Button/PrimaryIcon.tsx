import React from "react";
import cx from "classnames";

import { BaseButton, BaseButtonProps } from "./Base";

export function PrimaryIconButton(props: BaseButtonProps) {
  return (
    <BaseButton
      {...props}
      className={cx(
        "rounded-full p-1 bg-green-400 text-green-50",
        props.className
      )}
    />
  );
}
