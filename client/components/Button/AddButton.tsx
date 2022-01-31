import React from "react";

import { GhostInvertedButton, GhostInvertedButtonProps } from "./GhostInverted";

export function AddButton(props: GhostInvertedButtonProps) {
  return (
    <GhostInvertedButton
      {...props}
      className={`bg-transparent p-3 text-foreground rounded text-xs hover:bg-foregroundSlight focus:bg-foregroundSlight ${
        props.className || ""
      }`}
    >
      &#43;&nbsp;&nbsp;Add
    </GhostInvertedButton>
  );
}
