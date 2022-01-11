import React from "react";
import cx from "classnames";

import { BaseButton, BaseButtonProps } from "./Base";

type PrimaryButtonProps = BaseButtonProps;

export function PrimaryLightButton(
  props: PrimaryButtonProps
): React.ReactElement<React.HTMLProps<HTMLButtonElement>, any> {
  return (
    <BaseButton
      {...props}
      className={cx(
        "bg-purple-500 text-slate-50 font-bold bg-opacity-50 hover:bg-opacity-100 p-4 rounded text-sm uppercase shadow hover:shadow-md focus:shadow:md text-l",
        props.className
      )}
    />
  );
}
