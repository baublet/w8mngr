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
  ...props
}: BaseButtonProps) {
  const classNames = cx(
    {
      "inline-block": !full,
      "block text-center": full,
      "opacity-50 pointer-events-none": disabled,
    },
    className
  );
  console.log({leftIcon})
  return to ? (
    <>
      {leftIcon && <div className="mr-4">{leftIcon}</div>}
      <Link {...props} to={to} className={classNames} />
    </>
  ) : (
    <button {...props} className={classNames} />
  );
}
