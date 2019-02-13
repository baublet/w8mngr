import * as React from "react";
import BaseButton from "./Base";

export default function TransparentIconButton(
  props: React.HTMLProps<HTMLButtonElement>
): React.ReactElement<React.HTMLProps<HTMLButtonElement>, any> {
  const newClassNames = `p-1 color-inherit text-xs
      ${props.className || ""}
    `;
  return <BaseButton {...props} className={newClassNames} />;
}
