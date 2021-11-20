import React from "react";

export function PanelInverted(
  props: React.HTMLProps<HTMLInputElement>
) {
  const classNames = `bg-primary text-primaryText p-3 shadow rounded ${props.className ||
    ""}`;
  return (
    <div className={classNames}>
      <div className="relative">{props.children}</div>
    </div>
  );
}
