import React from "react";
import cx from "classnames";

export function Panel(props: React.PropsWithChildren<{ className?: string }>) {
  const classNames = cx(
    "hover:bg-slate-50 hover:bg-opacity-50",
    "border border-slate-100 hover:border-slate-300",
    "rounded-lg p-4",
    "hover:shadow-slate-500/10 hover:shadow-lg",
    props.className
  );
  return <div className={classNames}>{props.children}</div>;
}
