import * as React from "react";
import CheckMarkIcon from "./Check";

export default function SavedIcon(
  props: React.HTMLProps<HTMLInputElement>
): React.ReactComponentElement<any> {
  return (
    <div className="flex content-center text-xs opacity-75">
      <CheckMarkIcon />
      <span className="pl-1">SAVED</span>
    </div>
  );
}
