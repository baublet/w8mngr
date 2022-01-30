import React from "react";

import { BaseButton, BaseButtonProps } from "./Base";

export type TransparentIconButtonProps = BaseButtonProps;

export function TransparentIconButton(props: TransparentIconButtonProps) {
  return (
    <BaseButton
      {...props}
      className={`p-1 color-inherit text-xs ${props.className || ""}`}
    />
  );
}
