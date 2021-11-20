import React from "react";

import { BaseButton } from "./Base";

export function SecondaryIconButton(
  props: React.HTMLProps<HTMLButtonElement>
): React.ReactElement<React.HTMLProps<HTMLButtonElement>, any> {
  return (
    <BaseButton
      {...props}
      className={`rounded-full p-1 bg-secondary color-seondaryText
  ${props.className || ""}
`}
    />
  );
}
