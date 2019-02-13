import * as React from "react";

export default function ItemHeading(
  props: React.HTMLProps<HTMLInputElement>
): React.ReactComponentElement<any> {
  return <h4 className="text-base">{props.children}</h4>;
}
