import cx from "classnames";
import React from "react";

import { BaseButton, BaseButtonProps } from "./Base";

type SecondaryOutlineButtonProps = BaseButtonProps;

export function SecondaryOutlineButton(props: SecondaryOutlineButtonProps) {
  return (
    <BaseButton
      {...props}
      className={cx(
        "bg-emerald-100 bg-opacity-0 hover:bg-opacity:50 border border-emerald-400 hover:border-emerald-900 text-emerald-500 hover:text-emerald-900 font-bold p-4 rounded text-sm uppercase text-l",
        props.className
      )}
    />
  );
}
