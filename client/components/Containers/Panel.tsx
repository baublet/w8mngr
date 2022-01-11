import React from "react";
import cx from "classnames";

import { LogEntryLoadingBullet } from "../Loading/LogEntryLoadingBullet";

export function Panel(
  props: React.PropsWithChildren<{ className?: string; loading?: boolean }>
) {
  const classNames = cx(
    "hover:bg-slate-50 hover:bg-opacity-50",
    "border border-slate-100 hover:border-slate-300",
    "rounded-lg p-4",
    "hover:shadow-slate-500/10 hover:shadow-lg relative overflow-hidden",
    props.className,
    {
      "opacity-50 pointer-events-none": props.loading === true,
    }
  );
  return (
    <div className={classNames}>
      <LogEntryLoadingBullet visible={props.loading === true} />
      {props.children}
    </div>
  );
}
