import cx from "classnames";
import React from "react";

export function PanelInverted(
  props: React.PropsWithChildren<{ className?: string }>
) {
  const classNames = cx(
    "bg-slate-900 text-slate-50 p-3 shadow-lg hover:shadow rounded bg-opacity-90",
    props.className
  );
  return (
    <div className={classNames}>
      <div className="relative">{props.children}</div>
    </div>
  );
}
