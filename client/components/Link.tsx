import cx from "classnames";
import React from "react";
import { Link as BaseLink } from "react-router-dom";

export function Link({
  onClick,
  to = "#",
  className,
  children,
}: React.PropsWithChildren<{
  to?: string;
  onClick?: () => void;
  className?: string;
}>) {
  const LinkElement: any = onClick || to.includes("https://") ? "a" : BaseLink;
  return (
    <LinkElement
      to={to}
      href={to}
      onClick={onClick}
      className={cx(className, {
        "text-emerald-500 underline hover:text-emerald-900": !className,
      })}
    >
      {children}
    </LinkElement>
  );
}
