import React from "react";
import cx from "classnames";

let count = 0;

const border =
  "border-b border-foregroundLighter hover:border-foreground focus:border-foreground";

export type InputProps = {
  id?: string;
  label?: string;
  placeholder: string;
  showLabel?: boolean;
  className?: string;
  type: "text" | "password";
  onChange: (value: string) => void;
};

export function Input(
  props: InputProps
): React.ReactElement<React.HTMLProps<HTMLInputElement>, any> {
  const id = props.id || `input-inverted-${count++}`;
  const label = props.label;
  const { showLabel = true, className = "", onChange, ...newProps } = props;
  newProps.id = id;

  return (
    <>
      <input
        {...newProps}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        className={cx("leading-normal bg-transparent w-full px-2 py-2 border", {
          [border]: showLabel,
          [className]: className,
        })}
      />
      {!props.showLabel ? (
        <label htmlFor={newProps.id} className="screen-reader-text">
          {label}
        </label>
      ) : (
        <label
          htmlFor={newProps.id}
          className={cx(
            "block text-xxs uppercase whitespace-no-wrap overflow-hidden pb-1 text-foregroundLight",
            { [border]: showLabel }
          )}
        >
          {label}
        </label>
      )}
    </>
  );
}
