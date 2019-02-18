import * as React from "react";

let count = 0;

const border =
  "border-b border-foregroundLighter hover:border-foreground focus:border-foreground";

interface InputWithLabel {
  label: string;
}
interface InputWithPlaceholder {
  placeholder: string;
}
interface InputBasicProps extends React.HTMLProps<HTMLInputElement> {
  showLabel?: true;
}
export type InputProps = InputBasicProps &
  (InputWithLabel | InputWithPlaceholder);

export default function Input(
  props: InputProps
): React.ReactElement<React.HTMLProps<HTMLInputElement>, any> {
  const id = props.id || `input-inverted-${count++}`,
    label = props.placeholder || props.label,
    newProps = Object.assign({}, props, { id });
  if (newProps.showLabel) {
    delete newProps.showLabel;
  }
  return (
    <>
      <input
        {...newProps}
        className={`bg-transparent w-full py-2 ${
          !props.showLabel ? border : ""
        } ${props.className || ""}`}
      />
      {!props.showLabel ? (
        <label htmlFor={newProps.id} className="screen-reader-text">
          {label}
        </label>
      ) : (
        <label
          htmlFor={newProps.id}
          className={`block text-xxs uppercase mt-1 whitespace-no-wrap overflow-hidden pb-1 text-foregroundLight ${
            props.showLabel ? border : ""
          }`}
          style={{ textOverflow: "clip ellipsis" }}
        >
          {label}
        </label>
      )}
    </>
  );
}
