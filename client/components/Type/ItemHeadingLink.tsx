import * as React from "react";
import { Link } from "react-router-dom";

interface ItemHeadingLinkProps {
  to: string;
}

export default function ItemHeadingLink(
  props: React.HTMLProps<HTMLInputElement> & ItemHeadingLinkProps
): React.ReactComponentElement<any> {
  return (
    <h4 className="text-base">
      <Link to={props.to}>{props.children}</Link>
    </h4>
  );
}
