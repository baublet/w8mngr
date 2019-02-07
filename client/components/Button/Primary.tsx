import * as React from "react";

export default function BaseButton(
  props: React.HTMLProps<HTMLButtonElement>,
  onClick: () => {}
): React.ReactElement<React.HTMLProps<HTMLButtonElement>, any> {
  return <button {...props} />;
}
