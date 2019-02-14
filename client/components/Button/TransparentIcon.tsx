import * as React from "react";
import BaseButton from "./Base";
import { LinkProps } from "react-router-dom";

export default function TransparentIconButton(
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
