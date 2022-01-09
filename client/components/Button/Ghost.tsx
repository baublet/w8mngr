import React from "react";
import cx from "classnames";

import { BaseButton, BaseButtonProps } from "./Base";

const buttonClasses = `
bg-transparent
p-3
rounded
text-xs
uppercase
text-slate-800
hover:text-slate-600
`;

export function GhostButton(props: BaseButtonProps) {
  return (
    <BaseButton {...props} className={cx(buttonClasses, props.className)} />
  );
}
