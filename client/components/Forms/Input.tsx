import React from "react";
import cx from "classnames";

let count = 0;

const border =
  "border border-gray-500 border-opacity-25 hover:border-opacity-50 focus:border-opacity-100 rounded";
const background = "bg-white bg-opacity-50 hover:bg-opacity-100";

export type InputProps = {
  id?: string;
  label?: string;
  placeholder: string;
  showLabel?: boolean;
  className?: string;
  type: "text" | "password";
  onChange: (value: string) => void;
  focusOnFirstRender?: boolean;
};

export function Input(
  props: InputProps
): React.ReactElement<React.HTMLProps<HTMLInputElement>, any> {
  const id = props.id || `input-inverted-${count++}`;
  const label = props.label;
  const { showLabel = true, className = "", onChange, ...newProps } = props;
  newProps.id = id;
  const inputRef = React.useRef<HTMLInputElement>(null);

  console.log({ focusOnFirstRender: props.focusOnFirstRender });
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
        onChange={(event) => {
          onChange(event.target.value);
        }}
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
            "block text-xs uppercase whitespace-no-wrap overflow-hidden pt-1 text-gray-400 hover:text-gray-600 group-hover:text-gray-600"
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
}
