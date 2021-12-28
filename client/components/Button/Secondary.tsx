import React from "react";
import cx from "classnames";

import { BaseButton, BaseButtonProps } from "./Base";

type SecondaryButtonProps = BaseButtonProps;

export function SecondaryButton(
  props: SecondaryButtonProps
) {
  return (
    <BaseButton
      {...props}
      className={cx(
        "bg-emerald-500 text-slate-50 font-bold bg-opacity-90 hover:bg-opacity-100 p-4 text-white rounded text-sm uppercase shadow hover:shadow-md focus:shadow:md text-l",
        props.className
      )}
    />
  );
}
