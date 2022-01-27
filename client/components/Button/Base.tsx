import cx from "classnames";
import React from "react";
import { Link } from "react-router-dom";

export type BaseButtonProps = React.PropsWithChildren<{
  className?: string;
  disabled?: boolean;
  full?: boolean;
  to?: string;
  size?: "default" | "extra-small" | "extra-large" | "lg";
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
  const classNames = cx(className, "flex group items-center", {
    "block text-center w-full justify-center": full,
    "opacity-50 pointer-events-none": disabled,
    "p-3 gap-2 rounded": size === "default",
    "pl-2": leftIcon && size === "default",
    "pr-2": rightIcon && size === "default",
    "p-3 lowercase text-xs rounded gap-2": size === "extra-small",
    "p-8 normal-case text-4xl font-thin shadow hover:shadow-lg rounded-lg gap-6":
      size === "extra-large",
      "py-4 px-6 text-2xl font-thin rounded-lg shadow hover:shadow-lg": size === "lg"
  });

  const textClassNames = cx({
    "pb-1": size === "extra-large",
  });

  return to ? (
    <>
      <Link {...props} to={to} className={classNames}>
        {leftIcon && (
          <span className="opacity-75 group-hover:opacity-100">{leftIcon}</span>
        )}
        <div className={textClassNames}>{children}</div>
        {rightIcon}
      </Link>
    </>
  ) : (
    <button {...props} className={classNames} type={type}>
      {leftIcon && (
        <span className="opacity-75 group-hover:opacity-100">{leftIcon}</span>
      )}
      <div className={textClassNames}>{children}</div>
      {rightIcon}
    </button>
  );
}
