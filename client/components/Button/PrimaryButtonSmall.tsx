import * as React from "react";
import BaseButton from "./Base";
import { LinkProps } from "react-router-dom";

export default function PrimarySmallButton(
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
