import React from "react";

import { BaseButton, BaseButtonProps } from "./Base";

type SecondaryIconButtonProps = BaseButtonProps;

export function SecondaryIconButton(props: SecondaryIconButtonProps) {
  return <BaseButton {...props} className={`p-1 ${props.className || ""}`} />;
}
