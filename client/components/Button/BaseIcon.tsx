import React from "react";
import cx from "classnames";
import { Link } from "react-router-dom";

import { BaseButtonProps } from "./Base";

export type BaseIconButtonProps = Omit<
  BaseButtonProps,
  "leftIcon" | "rightIcon" | "full"
>;

export function BaseIconButton({
  to,
  disabled,
  type = "button",
  className,
  children,
  ...props
}: BaseIconButtonProps) {
  const classNames = cx(
    "flex gap-2 items-center",
    {
      "opacity-50 pointer-events-none": disabled,
    },
    className
  );

  return to ? (
    <>
      <Link {...props} to={to} className={classNames}>
        {children}
      </Link>
    </>
  ) : (
    <button {...props} className={classNames} type={type}>
      {children}
    </button>
  );
}
