import * as React from "react";

export default function ContentContainer(
  props: React.HTMLProps<HTMLInputElement>
) {
  const classNames = `mx-auto max-w-contentWidth w-full px-3 ${props.className ||
    ""}`;
  return <div className={classNames}>{props.children}</div>;
}
