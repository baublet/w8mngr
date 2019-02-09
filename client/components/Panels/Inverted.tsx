import * as React from "react";

export default function PanelInverted(
  props: React.HTMLProps<HTMLInputElement>
) {
  const classNames = `bg-primary text-background p-3 ${props.className}`;
  return <div className={classNames}>{props.children}</div>;
}
