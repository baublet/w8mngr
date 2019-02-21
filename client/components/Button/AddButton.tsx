import * as React from "react";
import GhostButton from "./GhostInverted";

export default function AddButton(
  props: React.HTMLProps<HTMLButtonElement>
): React.ReactElement<React.HTMLProps<HTMLButtonElement>, any> {
  return (
    <GhostButton
      {...props}
      className={`bg-transparent p-3 text-foreground rounded text-xs hover:bg-foregroundSlight focus:bg-foregroundSlight ${props.className ||
        ""}`}
    >
      &#43;&nbsp;&nbsp;Add
    </GhostButton>
  );
}
