import * as React from "react";

export default function PrimaryIconButton(
  props: React.HTMLProps<HTMLButtonElement>
): React.ReactElement<React.HTMLProps<HTMLButtonElement>, any> {
  const className = `rounded bg-primary color-primaryText ${props.className}`;
  return <button {...props} />;
}
