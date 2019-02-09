import * as React from "react";

export default function GhostInvertedButton(
  props: React.HTMLProps<HTMLButtonElement>
): React.ReactElement<React.HTMLProps<HTMLButtonElement>, any> {
  return (
    <button
      {...props}
      className="bg-transparent p-3 border border-background text-background rounded uppercase text-xs"
    />
  );
}
