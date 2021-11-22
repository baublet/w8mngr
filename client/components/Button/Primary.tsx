import React from "react";
import { LinkProps } from "react-router-dom";
import cx from "classnames";

import { BaseButton } from "./Base";

export function PrimaryButton(
  props: React.HTMLProps<HTMLButtonElement> | LinkProps
): React.ReactElement<React.HTMLProps<HTMLButtonElement>, any> {
  return (
    <BaseButton
      {...props}
      className={cx(
        "bg-primary text-primaryText hover:bg-primaryLight p-4 text-white rounded text-xs uppercase shadow hover:shadow-md focus:shadow:md text-l",
        props.className
      )}
    />
  );
}
