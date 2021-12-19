import React from "react";
import cx from "classnames";

import { InputProps } from "./Input";

let count = 0;

export type MultilineInputProps = InputProps;

export function MultilineInput(
  props: MultilineInputProps
): React.ReactElement<React.HTMLProps<HTMLInputElement>, any> {
  const id = props.id || `multi-line-${count++}`;
  const label = props.placeholder || props.label;
  const labelPlacement = props.labelPlacement || "top";
  const labelMarkup = React.useMemo(() => {
    if (props.showLabel === false) {
      return (
        <label htmlFor={id} className="screen-reader-text">
          {label}
        </label>
      );
    }
    return (
      <label htmlFor={id} className="uppercase opacity-50 text-xs py-2">
        {label}
      </label>
    );
  }, [label]);

  return (
    <>
      {labelPlacement === "top" && labelMarkup}
      <textarea
        onChange={(event) => props.onChange(event.target.value)}
        className={cx(
          `
          w-full
          p-4
          h-64
          focus:shadow-inner
          border
          border-gray-500
          border-opacity-25
          hover:border-opacity-50
          focus:border-opacity-100
          rounded
          bg-white
          bg-opacity-50
          hover:bg-opacity-100
          `,
          props.className
        )}
        value={props.defaultValue}
        defaultValue={props.value}
        placeholder={props.placeholder}
      />
      {labelPlacement === "bottom" && labelMarkup}
    </>
  );
}
