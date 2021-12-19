import React from "react";
import { Link as BaseLink } from "react-router-dom";

export function Link({
  onClick,
  to = "#",
  children,
}: React.PropsWithChildren<{ to?: string; onClick?: () => void }>) {
  const LinkElement: any = onClick ? "a" : BaseLink;
  return (
    <LinkElement
      to={to}
      href={to}
      onClick={onClick}
      className="text-emerald-500 underline hover:text-emerald-900"
    >
      {children}
    </LinkElement>
  );
}
