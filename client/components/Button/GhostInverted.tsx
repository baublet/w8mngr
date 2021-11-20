import React from "react";

import { BaseButton } from "./Base";

export function GhostInvertedButton(
  props: React.HTMLProps<HTMLButtonElement>
): React.ReactElement<React.HTMLProps<HTMLButtonElement>, any> {
  return (
    <BaseButton
      {...props}
      className={`bg-transparent p-3 border border-primaryText text-primaryText rounded uppercase text-xs ${props.className}`}
    />
  );
}
