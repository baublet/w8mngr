import React from "react";
import { LinkProps } from "react-router-dom";

import { BaseButton } from "./Base";

export function PrimarySmallButton(
  props: React.HTMLProps<HTMLButtonElement> | LinkProps
): React.ReactElement<React.HTMLProps<HTMLButtonElement>, any> {
  return (
    <BaseButton
      {...props}
      className={`
        bg-primary
        p-2
        text-primaryText
        rounded
        text-xxs
        uppercase
        hover:shadow-md
        focus:shadow:md
        ${props.className}
      `}
    />
  );
}
