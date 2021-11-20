import React from "react";

export function Panel(props: React.HTMLProps<HTMLInputElement>) {
  const classNames = `shadow p-3 bg-backgroundDark ${props.className || ""}`;
  return (
    <div className={classNames}>
      <div className="relative">{props.children}</div>
    </div>
  );
}
