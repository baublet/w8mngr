import React from "react";
import cx from "classnames";

export function PanelInverted(
  props: React.PropsWithChildren<{ className?: string }>
) {
  const classNames = cx(
    "bg-emerald-600 text-emerald-50 p-3 shadow-lg hover:shadow rounded bg-opacity-90",
    props.className
  );
  return (
    <div className={classNames}>
      <div className="relative">{props.children}</div>
    </div>
  );
}
