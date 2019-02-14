import * as React from "react";
import BaseButton from "./Base";

export default function PrimaryIconButton(
  props: React.HTMLProps<HTMLButtonElement>
): React.ReactElement<React.HTMLProps<HTMLButtonElement>, any> {
  return (
    <BaseButton
      {...props}
      className={`rounded-full p-1 bg-primary color-primaryText
  ${props.className || ""}
`}
    />
  );
}
