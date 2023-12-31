import React from "react";

import { or } from "../../../shared/coalesce";
import { InputProps } from "./Input";

let count = 0;

interface FoodEntryInputProps {
  hideLabel?: boolean;
  getRef?: (ref: React.RefObject<HTMLInputElement>) => void;
}

export function InputAutocompleteFood(props: FoodEntryInputProps & InputProps) {
  const id = or(props.id, `input-inverted-food-entry-${count++}`);
  const label = or(props.label, props.placeholder);
  const newProps = Object.assign({}, props, { id });
  const { getRef, hideLabel, className, size, onChange, ...inputOnlyProps } =
    newProps;
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (getRef) {
      getRef(ref);
    }
  }, []);

  return (
    <div>
      <input
        {...inputOnlyProps}
        className={`bg-transparent w-full border-transparent hover:border-foreground focus:border-foreground border-b ${className}`}
        ref={ref}
      />
      <label htmlFor={newProps.id} className="screen-reader-text">
        {label}
      </label>
    </div>
  );
}
