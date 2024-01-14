import React from "react";
import { Link } from "wouter";

import { or } from "../../../shared/coalesce";
import { LeftIcon } from "../Icons/Left";
import { BaseButtonProps } from "./Base";

export function BackToButton(
  props: Omit<BaseButtonProps, "leftIcon" | "onClick"> & {
    to?: string;
    onClick?: () => void;
  },
) {
  return (
    <Link
      className="inline-flex uppercase py-2 gap-2 text-xs items-center text-slate-500 hover:text-purple-600 group"
      to={or(props.to, "#")}
      onClick={(event) => {
        if (props.onClick) {
          event.preventDefault();
          props.onClick();
        }
      }}
    >
      <LeftIcon />
      <span
        className="border-b border-transparent group-hover:border-purple-600"
        style={{ transform: "translateX(1px)" }}
      >
        {props.children}
      </span>
    </Link>
  );
}
