import React from "react";
import cx from "classnames";

import { BaseButton, BaseButtonProps } from "./Base";

export function SecondaryIconButton(props: BaseButtonProps) {
  return (
    <BaseButton {...props} className={cx("rounded-full", props.className)} />
  );
}
