import React from "react";
import cx from "classnames";

export function ContentLayout(props: {
  className?: string;
  mainContent?: React.ReactElement;
  sideContent?: React.ReactElement;
}) {
  const classNames = cx("w-full flex", {
    [props.className || ""]: props.className,
  });
  return (
    <div className={classNames}>
      <div className="w-9/12">{props.mainContent || null}</div>
      <div className="w-3/12">{props.sideContent || null}</div>
    </div>
  );
}
