import React from "react";

export function EmptyNote(
  props: React.HTMLProps<HTMLInputElement>
) {
  return <div className="mt-5 text-xs">{props.children}</div>;
}
