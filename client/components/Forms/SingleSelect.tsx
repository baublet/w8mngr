import React from "react";

import { DownCaret } from "../Icons/DownCaret";

export function SingleSelect<
  T extends {
    text: string;
    key: string;
  }
>({
  options,
  id,
  label,
  onChange,
  defaultSelectedKey,
  labelPlacement = "top",
}: {
  id: string;
  label: string;
  options: T[];
  onChange: (selectedOption: T["key"] | undefined) => void;
  labelPlacement?: "top" | "bottom";
  defaultSelectedKey?: T["key"];
}) {
  const [selectedKey, setSelectedKey] = React.useState<T["key"] | undefined>(
    defaultSelectedKey
  );

  React.useEffect(() => {
    onChange(selectedKey);
  }, [selectedKey]);

  return (
    <div className="flex flex-col gap-2">
      {labelPlacement === "top" && (
        <label htmlFor={id} className="uppercase opacity-50 text-xs">
          {label}
        </label>
      )}
      <div className="border rounded border-slate-300 hover:border-slate-500 hover:shadow">
        <div className="flex items-center relative group">
          <label
            htmlFor={id}
            className="pointer-events-none p-4 absolute right-0 opacity-50 group-hover:opacity-80"
          >
            <DownCaret />
          </label>
          <select
            id={id}
            className="appearance-none text-lg p-4 pr-12 rounded"
            defaultValue={selectedKey}
            onChange={(event) => {
              setSelectedKey(event.target.value);
            }}
          >
            {options.map((option) => (
              <option key={option.key} className="font-sans" value={option.key}>
                {option.text}
              </option>
            ))}
          </select>
        </div>
      </div>
      {labelPlacement === "bottom" && (
        <label htmlFor={id} className="uppercase opacity-50 text-xs">
          {label}
        </label>
      )}
    </div>
  );
}
