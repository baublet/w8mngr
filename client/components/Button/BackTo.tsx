import React from "react";
import { Link } from "react-router-dom";

import { BaseButtonProps } from "./Base";
import { LeftIcon } from "../Icons/Left";

export function BackToButton(
  props: Omit<BaseButtonProps, "leftIcon" | "onClick"> & { to: string }
) {
  return (
    <Link
      className="inline-flex uppercase py-2 gap-2 text-xs items-center text-gray-500 hover:text-purple-600 group"
      to={props.to}
    >
      <LeftIcon />
      <span className="border-b border-transparent group-hover:border-purple-600" style={{ transform: "translateX(1px)" }}>{props.children}</span>
    </Link>
  );
}
