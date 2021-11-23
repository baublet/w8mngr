import React from "react";
import cx from "classnames";

let count = 0;

const border =
  "border-b-4 border-white border-opacity-60 hover:border-opacity-75 focus:border-opacity-100 rounded-sm";
const background =
  "bg-white bg-opacity-0 hover:bg-opacity-10 focus:bg-opacity-10";

export type InputProps = {
  id?: string;
  label?: string;
  placeholder: string;
  showLabel?: boolean;
  className?: string;
  type: "text" | "password";
  onChange: (value: string) => void;
  focusOnFirstRender?: boolean;
  defaultValue?: string | null;
  value?: string | null;
};

export function InputInverted(
  props: InputProps
): React.ReactElement<React.HTMLProps<HTMLInputElement>, any> {
  const id = props.id || `input-inverted-${count++}`;
  const label = props.label;
  const {
    showLabel = true,
    value,
    defaultValue,
    className = "",
    onChange,
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
        ref={inputRef}
        value={value === null ? undefined : value}
        defaultValue={!defaultValue ? undefined : defaultValue}
        onChange={(event) => onChange(event.target.value)}
        className={cx("leading-normal w-full px-2 py-2", border, background, {
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
            "block text-xs uppercase whitespace-no-wrap overflow-hidden pt-1 text-white text-opacity-40 hover:text-opacity-100 group-hover:text-opacity-100"
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
}
