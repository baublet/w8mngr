import React from "react";
import cx from "classnames";

export function ContentContainer(
  props: React.PropsWithChildren<{ className?: string }>
) {
  const classNames = cx("w-full px-3", {
    [props.className || ""]: props.className,
  });
  return <div className={classNames}>{props.children}</div>;
}
