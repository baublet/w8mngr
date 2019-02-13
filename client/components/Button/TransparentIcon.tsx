import * as React from "react";
import BaseButton from "./Base";
import { LinkProps } from "react-router-dom";

export default function TransparentIconButton(
  props: React.HTMLProps<HTMLButtonElement> | LinkProps
): React.ReactElement<React.HTMLProps<HTMLButtonElement | LinkProps>, any> {
  const newClassNames = `p-1 color-inherit text-xs
      ${props.className || ""}
    `;
  return <BaseButton {...props} className={newClassNames} />;
}
