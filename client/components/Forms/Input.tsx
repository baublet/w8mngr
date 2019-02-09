import * as React from "react";

let count = 0;

interface InputWithLabel {
  label: string;
}
interface InputWithPlaceholder {
  placeholder: string;
}
type InputBasicProps = React.HTMLProps<HTMLInputElement>;
export type InputProps = InputBasicProps &
  (InputWithLabel | InputWithPlaceholder);

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
        className="bg-transparent w-full py-2 border-b border-foregroundLighter hover:border-foreground focus:border-foreground"
      />
      <label htmlFor={newProps.id} className="screen-reader-text">
        {label}
      </label>
    </>
  );
}
