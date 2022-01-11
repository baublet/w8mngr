import React from "react";
import cx from "classnames";

import { BaseButtonProps } from "./Base";
import { PrimaryLightButton } from "./PrimaryLight";
import { Add } from "../Icons/Add";

type PrimaryButtonProps = Omit<BaseButtonProps, "children">;

export function PrimaryLightSaveButton(props: PrimaryButtonProps) {
  return (
    <PrimaryLightButton
      {...props}
      className={cx(
        "bg-purple-500 text-slate-50 font-bold bg-opacity-50 hover:bg-opacity-100 p-4 rounded text-sm uppercase shadow hover:shadow-md focus:shadow:md text-l",
        props.className
      )}
      leftIcon={<Add />}
      title="Save"
    >
      Save
    </PrimaryLightButton>
  );
}
