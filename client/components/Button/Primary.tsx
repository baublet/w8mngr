import React from "react";
import cx from "classnames";

import { BaseButton, BaseButtonProps } from "./Base";

type PrimaryButtonProps = BaseButtonProps;

export function PrimaryButton(
  props: PrimaryButtonProps
) {
  return (
    <BaseButton
      {...props}
      className={cx(
        "bg-purple-700 hover:bg-purple-800 text-slate-50 font-bold bg-opacity-90 hover:bg-opacity-100 text-sm uppercase",
        props.className
      )}
    />
  );
}
