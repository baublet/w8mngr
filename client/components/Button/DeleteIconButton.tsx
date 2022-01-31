import React from "react";
import cx from "classnames";

import { BaseButtonProps } from "./Base";
import { GhostButton } from "./Ghost";
import { CloseIcon } from "../Icons/Close";

const buttonClass = `
bg-transparent
p-3
text-slate-900
text-opacity-25
rounded-full
text-xs

hover:bg-rose-700
active:bg-rose-700
focus:bg-rose-700

group
`;

export function DeleteIconButton(props: BaseButtonProps) {
  const { onClick, ...newProps } = props,
    newOnclick = () => {
      onClick?.();
    };
  return (
    <GhostButton
      {...newProps}
      className={cx(props.className, buttonClass)}
      onClick={newOnclick}
    >
      <span className="screen-reader-text">Delete</span>
      <span className="group-hover:text-white">
        <CloseIcon />
      </span>
    </GhostButton>
  );
}
