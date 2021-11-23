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
      className={`bg-transparent p-3 text-red-500 border border-red-500 rounded text-xs hover:bg-red-500 focus:bg-red-500 hover:text-white focus:rext-white ${
        props.className || ""
      }`}
      onClick={newOnclick}
    />
  );
}
