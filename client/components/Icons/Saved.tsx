import React from "react";

import { CheckMarkIcon } from "./Check";

export function SavedIcon() {
  return (
    <div className="flex content-center text-xs opacity-75">
      <CheckMarkIcon />
      <span className="pl-1">SAVED</span>
    </div>
  );
}
