import React from "react";

export function ItemHeading(
  props: React.PropsWithChildren<{}>
): React.ReactComponentElement<any> {
  return <h4 className="text-base">{props.children}</h4>;
}
