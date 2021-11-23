import React from "react";
import cx from "classnames";

let count = 0;

const inputClassNames = `
bg-transparent
w-full
py-1
border-b
border-gray-900
border-opacity-10
group-hover:border-opacity-25
hover:border-opacity-25
text-base
text-gray-400
hover:text-gray-700
focus:text-gray-800
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
  props: InputFoodEntriesProps
): React.ReactElement<React.HTMLProps<HTMLInputElement>, any> {
  const id = props.id || `input-${count++}`;
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
    <div className="group">
      <input
        {...newProps}
        value={value === null ? undefined : value}
        defaultValue={!defaultValue ? undefined : defaultValue}
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
            "block border-b text-gray-900 text-opacity-60 text-sm border-transparent hover:opacity-100 group-hover:opacity-100 focus:opacity-100 uppercase opacity-50"
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
}
