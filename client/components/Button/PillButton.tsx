import React from "react";

import { BaseButton, BaseButtonProps } from "./Base";

export type PullButtonProps = BaseButtonProps;

export function PillButton(
  props: PullButtonProps
) {
  return (
    <BaseButton
      {...props}
      className={`opacity-75 hover:opacity-100 border border-foregroundLight text-xxs p-1 rounded mr-2 uppercase`}
    />
  );
}
