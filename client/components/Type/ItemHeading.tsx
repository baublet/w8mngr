import React from "react";

export function ItemHeading(
  props: React.PropsWithChildren<{}>
) {
  return <h4 className="text-sm font-bold text-gray-700 text-opacity-60 block">{props.children}</h4>;
}
