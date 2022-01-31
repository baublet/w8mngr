import cx from "classnames";
import React from "react";

interface PageHeadingProps {
  quickLinks?: React.ReactElement;
  children: React.ReactElement | string;
  className?: string;
  icon?: React.ReactElement;
}

export function PageHeading(props: PageHeadingProps) {
  const topStyle = props.icon
    ? ({ transform: "translate(-5.75em, 0)" } as const)
    : {};

  return (
    <div
      className={cx(`
          flex
          gap-10
          items-center
    `)}
      style={topStyle}
    >
      {props.icon && (
        <div className="text-5xl text-slate-50 flex justify-center items-center rounded-bl-full rounded-tl-full w-16 h-16 bg-emerald-400 text-center">
          {props.icon}
        </div>
      )}
      <div className="flex flex-col w-full">
        <h3
          className={cx(
            "text-3xl font-thin text-slate-400 block w-full",
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
