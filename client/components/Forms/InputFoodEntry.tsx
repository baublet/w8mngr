import cx from "classnames";
import React from "react";

import { or } from "../../../shared/coalesce";

let count = 0;

const inputClassNames = `
bg-transparent
w-full
py-1
border-b
border-slate-900
border-opacity-10
group-hover:border-opacity-25
hover:border-opacity-25
text-base
text-slate-600
hover:text-slate-700
focus:text-slate-800
`;

export type InputFoodEntriesProps = {
  value?: string | null | number;
  defaultValue?: string | null | number;
  id?: string;
  label?: string;
  showLabel?: boolean;
  className?: string;
  type: "text" | "password";
  onChange: (value: string) => void;
  focusOnFirstRender?: boolean;
};

export function InputFoodEntry(
  props: InputFoodEntriesProps,
): React.ReactElement<React.HTMLProps<HTMLInputElement>, any> {
  const id = or(props.id, `input-${count++}`);
  const label = props.label;
  const {
    showLabel = true,
    className = "",
    onChange,
    defaultValue,
    value,
    ...newProps
  } = props;
  newProps.id = id;
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (props.focusOnFirstRender) {
      inputRef.current?.focus();
    }
  }, []);

  return (
    <div>
      <input
        {...newProps}
        value={value === null ? undefined : value}
        defaultValue={!defaultValue ? undefined : `${defaultValue}`}
        ref={inputRef}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        className={cx(inputClassNames, {
          [className]: className,
        })}
      />
      {props.showLabel === false ? (
        <label htmlFor={newProps.id} className="screen-reader-text">
          {label}
        </label>
      ) : (
        <label
          htmlFor={newProps.id}
          className={cx(
            "block border-b text-slate-600 text-sm border-transparent hover:opacity-100 group-hover:opacity-100 focus:opacity-100 uppercase opacity-75",
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
}
