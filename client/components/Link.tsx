import cx from "classnames";
import React from "react";
import { Link as BaseLink } from "wouter";

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
  return (
    <BaseLink href={to}>
      <a
        onClick={onClick}
        className={cx(className, {
          "text-emerald-500 underline hover:text-emerald-900": !className,
        })}
      >
        {children}
      </a>
    </BaseLink>
  );
}
