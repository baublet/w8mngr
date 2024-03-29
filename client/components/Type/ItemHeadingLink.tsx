import React from "react";
import { Link } from "react-router-dom";

interface ItemHeadingLinkProps {
  to: string;
}

export function ItemHeadingLink(
  props: React.HTMLProps<HTMLInputElement> & ItemHeadingLinkProps
) {
  return (
    <h4 className="text-base">
      <Link to={props.to}>{props.children}</Link>
    </h4>
  );
}
