import * as React from "react";
import { InputProps } from "./Input";

let count = 0;

interface FoodEntryInputProps {
  hideLabel?: boolean;
}

export default function InputFoodEntry(
  props: FoodEntryInputProps & InputProps
): React.ReactElement<React.HTMLProps<HTMLInputElement>, any> {
  const id = props.id || `input-inverted-food-entry-${count++}`,
    label = props.placeholder || props.label,
    newProps = Object.assign({}, props, { id }),
    { hideLabel, className, ...inputOnlyProps } = newProps;
  return (
    <>
      <input
        {...inputOnlyProps}
        className={`bg-transparent w-full py-1 border-transparent hover:border-foreground focus:border-foreground border-b ${className}`}
      />
      <label
        htmlFor={newProps.id}
        className={
          newProps.hideLabel
            ? "screen-reader-text"
            : "block border-b border-transparent hover:opacity-100 focus:opacity-100 text-xxs uppercase opacity-50"
        }
      >
        {label}
      </label>
    </>
  );
}
