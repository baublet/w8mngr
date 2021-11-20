import React from "react";
import { LinkProps } from "react-router-dom";

import { BaseButton } from "./Base";

export function PrimaryButton(
  props: React.HTMLProps<HTMLButtonElement> | LinkProps
): React.ReactElement<React.HTMLProps<HTMLButtonElement>, any> {
  return (
    <BaseButton
      {...props}
      className={`bg-primary p-3 text-primaryText rounded text-xs uppercase shadow hover:shadow-md focus:shadow:md ${props.className}`}
    />
  );
}
