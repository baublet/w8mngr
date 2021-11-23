import React from "react";
import cx from "classnames";

export function PanelInverted(
  props: React.PropsWithChildren<{ className?: string }>
) {
  const classNames = cx(
    "bg-purple-700 text-purple-50 p-3 shadow-lg hover:shadow rounded",
    props.className
  );
  return (
    <div className={classNames}>
      <div className="relative">{props.children}</div>
    </div>
  );
}
