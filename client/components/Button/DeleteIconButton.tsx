import React from "react";

import { GhostButton } from "./Ghost";
import { CloseIcon } from "../Icons/Close";

export function DeleteIconButton(
  props: React.HTMLProps<HTMLButtonElement>
) {
  const { onClick, ...newProps } = props,
    newOnclick = (e: any) => {
      e.preventDefault();
        onClick?.(e);
    };
  return (
    <GhostButton
      {...newProps}
      className={`bg-transparent p-3 text-gray-400 rounded-full text-xs hover:bg-red-700 focus:bg-red-700 focus:text-white hover:text-white ${
        props.className || ""
      }`}
      onClick={newOnclick}
    >
      <span className="screen-reader-text">Delete</span>
      <CloseIcon />
    </GhostButton>
  );
}
