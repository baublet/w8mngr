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
  forwardedRef?: React.RefObject<HTMLInputElement>;
}
export type InputProps = InputBasicProps &
  (InputWithLabel | InputWithPlaceholder);

export default function Input(
  props: InputProps
): React.ReactElement<React.HTMLProps<HTMLInputElement>, any> {
  const id = props.id || `input-inverted-${count++}`;
  const label = props.label || props.placeholder;
  const { showLabel, forwardedRef, ...newProps } = props;
  newProps.id = id;

  return (
    <>
      <input
        ref={props.forwardedRef}
        {...newProps}
        className={`leading-normal bg-transparent w-full pt-2 py-1 ${
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
          className={`block text-xxs uppercase whitespace-no-wrap overflow-hidden pb-1 text-foregroundLight ${
            props.showLabel ? border : ""
          }`}
        >
          {label}
        </label>
      )}
    </>
  );
}
