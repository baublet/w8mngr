import React from "react";
import cx from "classnames";

export function Panel(props: React.PropsWithChildren<{ className?: string }>) {
  const classNames = cx(
    "rounded-lg bg-slate-50 p-4 border border-slate-100 hover:bg-slate-100 hover:border-slate-200",
    props.className
  );
  return <div className={classNames}>{props.children}</div>;
}
