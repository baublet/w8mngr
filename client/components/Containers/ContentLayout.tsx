import cx from "classnames";
import React from "react";

export function ContentLayout(props: {
  className?: string;
  mainContent?: React.ReactElement;
  sideContent?: React.ReactElement;
}) {
  const classNames = cx(
    "w-full flex flex-col lg:flex-row-reverse gap-4 lg:gap-8",
    props.className
  );
  return (
    <div className={classNames}>
      <div className="w-full lg:w-3/12">{props.sideContent || null}</div>
      <div className="w-full lg:w-9/12">{props.mainContent || null}</div>
    </div>
  );
}
