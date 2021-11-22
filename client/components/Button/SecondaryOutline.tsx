import React from "react";
import cx from "classnames";

import { BaseButton, BaseButtonProps } from "./Base";

type SecondaryOutlineButtonProps = BaseButtonProps;

export function SecondaryOutlineButton(
  props: SecondaryOutlineButtonProps
): React.ReactElement<React.HTMLProps<HTMLButtonElement>, any> {
  return (
    <BaseButton
      {...props}
      className={cx(
        "bg-green-100 bg-opacity-0 hover:bg-opacity:50 border border-green-400 hover:border-green-900 text-green-500 hover:text-green-900 font-bold p-4 rounded text-sm uppercase text-l",
        props.className
      )}
    />
  );
}
