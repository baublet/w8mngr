import React from "react";
import cx from "classnames";

import { BaseButton, BaseButtonProps } from "./Base";

type PrimaryButtonProps = BaseButtonProps;

export function PrimaryButton(
  props: PrimaryButtonProps
): React.ReactElement<React.HTMLProps<HTMLButtonElement>, any> {
  return (
    <BaseButton
      {...props}
      className={cx(
        "bg-purple-900 text-slate-50 font-bold bg-opacity-90 hover:bg-opacity-100 text-sm uppercase shadow hover:shadow-md focus:shadow:md",
        props.className
      )}
    />
  );
}
