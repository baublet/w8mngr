import * as React from "react";

export default function BaseButton(
  props: React.HTMLProps<HTMLButtonElement>
): React.ReactElement<React.HTMLProps<HTMLButtonElement>, any> {
  return (
    <button {...props} className="bg-primary p-3 text-primaryText rounded-sm" />
  );
}