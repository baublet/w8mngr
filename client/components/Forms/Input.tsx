import * as React from "react";

let count = 0;

export interface InputProps extends React.HTMLProps<HTMLInputElement> {
  label: string;
}

export default function Input(
  props: InputProps
): React.ReactElement<React.HTMLProps<HTMLInputElement>, any> {
  const id = props.id || `input-${count++}`,
    newProps = Object.assign({}, props, { id });
  return (
    <>
      <input
        {...newProps}
        className="bg-transparent w-full py-2 border-b border-foregroundLighter hover:border-foreground focus:border-foreground"
      />
      <label htmlFor={newProps.id} className="screen-reader-text">
        {newProps.label}
      </label>
    </>
  );
}
