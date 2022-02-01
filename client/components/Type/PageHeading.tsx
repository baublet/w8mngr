import cx from "classnames";
import React from "react";

interface PageHeadingProps {
  quickLinks?: React.ReactElement;
  children: React.ReactElement | string;
  className?: string;
  icon?: React.ReactElement;
}

export function PageHeading(props: PageHeadingProps) {
  return (
    <div className={`flex gap-4`}>
      {props.icon && (
        <div
          className={`
            text-5xl
            text-purple-300
            text-opacity-50`}
        >
          {props.icon}
        </div>
      )}
      <div className="flex flex-col w-full">
        <h3
          className={cx(
            "text-3xl font-thin text-slate-500 block w-full",
            props.className
          )}
        >
          {props.children}
        </h3>
        {props.quickLinks && <div>{props.quickLinks}</div>}
      </div>
    </div>
  );
}
