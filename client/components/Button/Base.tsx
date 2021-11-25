import React from "react";
import cx from "classnames";
import { Link } from "react-router-dom";

export type BaseButtonProps = React.PropsWithChildren<{
  className?: string;
  disabled?: boolean;
  full?: boolean;
  to?: string;
  onClick?: () => void;
  type?: string;
  leftIcon?: JSX.Element;
}>;

export function BaseButton({
  to,
  disabled,
  full,
  type = "button",
  className,
  leftIcon,
  children,
  ...props
}: BaseButtonProps) {
  const classNames = cx(
    "flex gap-4",
    {
      "block text-center w-full justify-center": full,
      "opacity-50 pointer-events-none": disabled,
    },
    className
  );

  return to ? (
    <>
      <Link {...props} to={to} className={classNames}>
        {leftIcon}
        {children}
      </Link>
    </>
  ) : (
    <button {...props} className={classNames}>
      {leftIcon}
      {children}
    </button>
  );
}
