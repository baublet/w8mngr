import * as React from "react";

export default function PanelInverted(
  props: React.HTMLProps<HTMLInputElement>
) {
  const classNames = `shadow p-3 bg-backgroundDark ${props.className}`;
  return <div className={classNames}>{props.children}</div>;
}
