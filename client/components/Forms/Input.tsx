import * as React from "react";

let count = 0;

export default function Input(
  props: React.HTMLProps<HTMLInputElement>
): React.ReactElement<React.HTMLProps<HTMLInputElement>, any> {
  const id = props.id || `input-${count++}`,
    newProps = Object.assign({}, props, { id });
  return (
    <>
      {!props.label ? (
        false
      ) : (
        <label htmlFor={newProps.id}>{newProps.label}</label>
      )}
      <input {...newProps} />
    </>
  );
}
