import * as React from "react";
import BaseButton from "./Base";

export default function GhostButton(
  props: React.HTMLProps<HTMLButtonElement>
): React.ReactElement<React.HTMLProps<HTMLButtonElement>, any> {
  return (
    <BaseButton
      {...props}
      className={`bg-transparent p-3 text-foreground rounded text-xs uppercase hover:bg-foregroundSlight focus:bg-foregroundSlight ${props.className ||
        ""}`}
    />
  );
}
