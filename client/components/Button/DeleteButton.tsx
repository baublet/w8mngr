import React from "react";

import { GhostButton, GhostButtonProps } from "./Ghost";

export function DeleteButton(props: GhostButtonProps) {
  const { onClick, ...newProps } = props,
    newOnclick = (e?: any) => {
      e?.preventDefault();
      if (window.confirm("Are you sure?")) {
        onClick?.();
      }
    };
  return (
    <GhostButton
      {...newProps}
      className={`
      bg-transparent
      p-3
      text-rose-500
      border
      border-rose-500
      rounded text-xs
      hover:bg-rose-500
      focus:bg-rose-500
      hover:text-white
      focus:text-white
      ${props.className || ""}`}
      onClick={newOnclick}
    />
  );
}
