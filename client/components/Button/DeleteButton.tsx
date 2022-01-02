import React from "react";

import { GhostButton } from "./Ghost";

export function DeleteButton(
  props: React.HTMLProps<HTMLButtonElement>
) {
  const { onClick, ...newProps } = props,
    newOnclick = (e: any) => {
      e.preventDefault();
      if (window.confirm("Are you sure?")) {
        onClick?.(e);
      }
    };
  return (
    <GhostButton
      {...newProps}
      className={`bg-transparent p-3 text-rose-500 border border-rose-500 rounded text-xs hover:bg-rose-500 focus:bg-rose-500 hover:text-white focus:rext-white ${
        props.className || ""
      }`}
      onClick={newOnclick}
    />
  );
}
