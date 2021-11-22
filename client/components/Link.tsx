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
      className="text-green-500 underline hover:text-green-900"
    >
      {children}
    </LinkElement>
  );
}
