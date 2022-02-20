import cx from "classnames";
import React from "react";

import { or } from "../../../shared";

export type ToggleProps = {
  value?: boolean | null | number;
  id: string;
  label: string;
  labelPosition: "left" | "right";
  onChange: (value: boolean) => void;
};

export function Toggle(props: ToggleProps) {
  const [value, setValue] = React.useState(Boolean(props.value));

  React.useEffect(() => {
    props.onChange(value);
  }, [value]);

  return (
    <div className="flex items-center justify-center w-full group">
      <label htmlFor={props.id} className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            id={props.id}
            className="sr-only"
            defaultChecked={value}
            onChange={() => setValue(!value)}
          />
          <div
            className={cx("absolute inset-0 flex items-center justify-center")}
          />
          <div className="bg-slate-200 w-14 h-8 rounded shadow-inner"></div>
          <div
            className={cx(
              `
              dot
              absolute
              left-1
              top-1
              w-6
              h-6
              rounded
              transition
              shadow
            `,
              {
                "bg-slate-50 hover:bg-slate-100": !value,
                "bg-emerald-400 hover:bg-emerald-500": value,
              }
            )}
          ></div>
        </div>
        <div className="ml-3 text-slate-800 select-none font-thin text-xl hover:text-emerald-700">
          {props.label}
        </div>
      </label>
    </div>
  );
}
