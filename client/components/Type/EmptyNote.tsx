import * as React from "react";

export default function EmptyNote(
  props: React.HTMLProps<HTMLInputElement>
): React.ReactComponentElement<any> {
  return <div className="mt-5 text-xs">{props.children}</div>;
}
