import * as React from "react";

export default function PanelInverted(
  props: React.HTMLProps<HTMLInputElement>
) {
  const classNames = `bg-primary text-primaryText p-3 shadow rounded ${
    props.className
  }`;
  return <div className={classNames}>{props.children}</div>;
}
