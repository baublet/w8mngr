import cx from "classnames";
import React from "react";

export function ContentContainer(
  props: React.PropsWithChildren<{ className?: string; fullFill?: boolean }>
) {
  const classNames = cx(
    "w-full",
    {
      "px-3": !props.fullFill,
      "p-0": props.fullFill,
    },
    props.className
  );
  return <div className={classNames}>{props.children}</div>;
}
