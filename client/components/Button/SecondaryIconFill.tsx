import cx from "classnames";
import React from "react";

import { BaseButton, BaseButtonProps } from "./Base";

type SecondaryIconButtonProps = BaseButtonProps;

export function SecondaryIconButton(props: SecondaryIconButtonProps) {
  return <BaseButton {...props} className={cx("p-1", props.className)} />;
}
