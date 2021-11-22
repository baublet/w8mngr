import React from "react";
import cx from "classnames";

import { BaseButton } from "./Base";

export function PrimaryIconButton(
  props: React.HTMLProps<HTMLButtonElement>
): React.ReactElement<React.HTMLProps<HTMLButtonElement>, any> {
  return (
    <BaseButton
      {...props}
      className={cx(
        "rounded-full p-1 bg-primary color-primaryText",
        props.className
      )}
    />
  );
}
