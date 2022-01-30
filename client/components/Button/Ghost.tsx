import cx from "classnames";
import React from "react";

import { BaseButton, BaseButtonProps } from "./Base";

const buttonClasses = `
bg-transparent
rounded
text-xs
uppercase
text-slate-800
hover:text-slate-600
`;

export type GhostButtonProps = BaseButtonProps;

export function GhostButton(props: GhostButtonProps) {
  return (
    <BaseButton {...props} className={cx(buttonClasses, props.className)} />
  );
}
