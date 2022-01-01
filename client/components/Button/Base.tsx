import React from "react";
import cx from "classnames";
import { Link } from "react-router-dom";

export type BaseButtonProps = React.PropsWithChildren<{
  className?: string;
  disabled?: boolean;
  full?: boolean;
  to?: string;
  size?: "default" | "extra-small";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  title?: string;
}>;

export function BaseButton({
  to,
  disabled,
  full,
  type = "button",
  className,
  leftIcon,
  children,
  rightIcon,
  size = "default",
  ...props
}: BaseButtonProps) {
  const classNames = cx(className, "flex gap-2 items-center rounded", {
    "block text-center w-full justify-center": full,
    "opacity-50 pointer-events-none": disabled,
    "p-3": size === "default",
    "pl-2": leftIcon && size === "default",
    "pr-2": rightIcon && size === "default",
    "p-3 lowercase text-xs": size === "extra-small",
  });

  return to ? (
    <>
      <Link {...props} to={to} className={classNames}>
        {leftIcon}
        <div>{children}</div>
        {rightIcon}
      </Link>
    </>
  ) : (
    <button {...props} className={classNames} type={type}>
      {leftIcon}
      <div>{children}</div>
      {rightIcon}
    </button>
  );
}
