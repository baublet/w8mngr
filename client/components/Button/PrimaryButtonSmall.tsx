import React from "react";

import { BaseButton, BaseButtonProps } from "./Base";

export type PrimarySmallButtonProps = BaseButtonProps;

export function PrimarySmallButton(props: PrimarySmallButtonProps) {
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
