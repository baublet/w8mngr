import * as React from "react";
import BaseButton from "./Base";

export default function PillButton(
  props: React.HTMLProps<HTMLButtonElement>
): React.ReactElement<React.HTMLProps<HTMLButtonElement>, any> {
  return (
    <BaseButton
      {...props}
      className={`opacity-75 hover:opacity-100 border border-foregroundLight text-xxs p-1 rounded mr-2 uppercase`}
    />
  );
}
