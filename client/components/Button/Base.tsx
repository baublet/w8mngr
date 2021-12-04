import React from "react";
import cx from "classnames";
import { Link } from "react-router-dom";

export type BaseButtonProps = React.PropsWithChildren<{
  className?: string;
  disabled?: boolean;
  full?: boolean;
  to?: string;
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
  ...props
}: BaseButtonProps) {
  const classNames = cx(
    "flex gap-2 items-center",
    {
      "block text-center w-full justify-center": full,
      "opacity-50 pointer-events-none": disabled,
      "pl-2": leftIcon,
      "pr-2": rightIcon,
    },
    className
  );

  return to ? (
    <>
      <Link {...props} to={to} className={classNames}>
        {leftIcon}
        <div style={{ transform: "translateY(1px)" }}>{children}</div>
        {rightIcon}
      </Link>
    </>
  ) : (
    <button {...props} className={classNames} type={type}>
      {leftIcon}
      <div style={{ transform: "translateY(1px)" }}>{children}</div>
      {rightIcon}
    </button>
  );
}
