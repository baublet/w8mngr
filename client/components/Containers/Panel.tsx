import cx from "classnames";
import React from "react";

import { LogEntryLoadingBullet } from "../Loading/LogEntryLoadingBullet";

export function Panel(
  props: React.PropsWithChildren<{
    className?: string;
    loading?: boolean;
    size?: "s";
  }>
) {
  const classNames = cx(
    `
    hover:bg-slate-50
    hover:bg-opacity-50
    border
    border-slate-50
    hover:border-slate-100
    rounded-lg
    hover:shadow-slate-500/10
    hover:shadow-lg
    relative
    overflow-hidden`,
    props.className,
    {
      "opacity-50 pointer-events-none": props.loading === true,
      "p-4": props.size !== "s",
      "p-2": props.size === "s",
    }
  );
  return (
    <div className={classNames}>
      <LogEntryLoadingBullet visible={props.loading === true} />
      {props.children}
    </div>
  );
}
