import React from "react";
import cx from "classnames";

import { BaseButtonProps } from "./Base";
import { GhostButton } from "./Ghost";
import { CloseIcon } from "../Icons/Close";

const buttonClass = `
bg-transparent
p-3
text-gray-400
rounded-full
text-xs

hover:bg-red-700
active:bg-red-700
focus:bg-red-700

active:text-white
focus:text-white
hover:text-white
`;

export function DeleteIconButton(props: BaseButtonProps) {
  const { onClick, ...newProps } = props,
    newOnclick = () => {
      onClick?.();
    };
  return (
    <GhostButton
      {...newProps}
      className={cx(buttonClass, props.className)}
      onClick={newOnclick}
    >
      <span className="screen-reader-text">Delete</span>
      <CloseIcon />
    </GhostButton>
  );
}
