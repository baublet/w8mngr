import cx from "classnames";
import React from "react";

import { or } from "../../../shared/coalesce";

let count = 0;

const border = `
  border
  border-slate-900
  border-opacity-25
  hover:border-opacity-50
  focus:border-opacity-100
  active:border-opacity-100
  rounded`;
const background = `
  bg-white
  bg-opacity-50
  hover:bg-opacity-100 
  focus:bg-opacity-100 
  active:bg-opacity-100`;

export type InputProps = {
  id?: string;
  label?: string;
  placeholder: string;
  showLabel?: boolean;
  className?: string;
  type: "text" | "password";
  onChange: (value: string) => void;
  focusOnFirstRender?: boolean;
  value?: string | number;
  defaultValue?: string;
  labelPlacement?: "top" | "bottom";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
};

export function Input(props: InputProps) {
  const id = or(props.id, `input-${count++}`);
  const label = props.label;
  const {
    showLabel = true,
    className = "",
    onChange,
    value = "",
    focusOnFirstRender,
    labelPlacement = "top",
    size = "md",
    ...newProps
  } = props;
  newProps.id = id;
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const element = inputRef.current;
    if (element && focusOnFirstRender) {
      element.focus();
      element.setSelectionRange(0, element.value.length);
    }
  }, []);

  const labelMarkup = React.useMemo(() => {
    return props.showLabel === false ? (
      <label htmlFor={newProps.id} className="screen-reader-text">
        {label}
      </label>
    ) : (
      <label
        htmlFor={newProps.id}
        className={cx(
          "block text-xs uppercase whitespace-no-wrap overflow-hidden text-slate-500 hover:text-slate-600 group-hover:text-slate-600",
        )}
      >
        {label}
      </label>
    );
  }, []);

  return (
    <div
      className={cx("group flex flex-col gap-2", {
        "opacity-25 pointer-events-none": props.disabled,
      })}
    >
      {labelPlacement === "top" && labelMarkup}
      <input
        {...newProps}
        ref={inputRef}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        className={cx(
          "leading-normal w-full p-4",
          border,
          background,
          {
            ["p-1"]: size === "sm",
            ["p-2"]: size === "md",
            ["p-4"]: size === "lg",
          },
          className,
        )}
        value={value}
      />
      {labelPlacement === "bottom" && labelMarkup}
    </div>
  );
}
