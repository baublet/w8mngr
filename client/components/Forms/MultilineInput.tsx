import React from "react";

let count = 0;

interface MultilineInputWithLabel {
  label: string;
}
interface MultilineInputWithPlaceholder {
  placeholder: string;
}
type InputBasicProps = React.HTMLProps<HTMLTextAreaElement>;
export type MultilineInputProps = InputBasicProps &
  (MultilineInputWithLabel | MultilineInputWithPlaceholder);

export function MultilineInput(
  props: MultilineInputProps
): React.ReactElement<React.HTMLProps<HTMLInputElement>, any> {
  const id = props.id || `input-inverted-${count++}`,
    label = props.placeholder || props.label,
    newProps = Object.assign({}, props, { id });
  return (
    <>
      <label htmlFor={newProps.id} className="screen-reader-text">
        {label}
      </label>
      <textarea
        {...newProps}
        className={`bg-foregroundSlight w-full py-2 border rounded p-3 border-foregroundLighter hover:border-foreground focus:border-foreground h-64 shadow-inner ${
          props.className || ""
        }`}
      />
    </>
  );
}
