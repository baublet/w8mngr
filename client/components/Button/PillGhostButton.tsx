import React from "react";
import { LinkProps } from "react-router-dom";

import { BaseButton } from "./Base";

export function PillButton(
  props: React.HTMLProps<HTMLButtonElement> | LinkProps
): React.ReactElement<React.HTMLProps<HTMLButtonElement>, any> {
  return (
    <BaseButton
      {...props}
      className={`opacity-75 hover:opacity-100 border border-transparent hover:border-foregroundLight text-xxs p-1 rounded mr-2 uppercase`}
    />
  );
}
