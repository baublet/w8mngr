import * as React from "react";
import { InputProps } from "./Input";

let count = 0;

export default function Input(
  props: InputProps
): React.ReactElement<React.HTMLProps<HTMLInputElement>, any> {
  const id = props.id || `input-inverted-${count++}`,
    label = props.placeholder || props.label,
    newProps = Object.assign({}, props, { id });
  return (
    <>
      <input
        {...newProps}
        className="text-background bg-transparent w-full py-2 uppercase text-xs text-inherit opacity-75 hover:opacity-100 focus:opacity-100 border-b border-background block"
      />
      <label htmlFor={newProps.id} className="screen-reader-text">
        {label}
      </label>
    </>
  );
}
