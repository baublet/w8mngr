import React from "react";
import { LinkProps } from "react-router-dom";

import { BaseButton } from "./Base";

export function TransparentIconButton(
  props: React.HTMLProps<HTMLButtonElement> | LinkProps
): React.ReactElement<React.HTMLProps<HTMLButtonElement | LinkProps>, any> {
  return (
    <BaseButton
      {...props}
      className={`p-1 color-inherit text-xs
  ${props.className || ""}
`}
    />
  );
}
