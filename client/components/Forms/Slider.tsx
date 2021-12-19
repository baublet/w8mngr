import React from "react";
import cx from "classnames";

export function Slider({
  id,
  label,
  max,
  min,
  defaultValue,
  higherLabel,
  lowerLabel,
  onChange,
}: {
  min: number;
  max: number;
  defaultValue?: number;
  id: string;
  label: string;
  lowerLabel?: string;
  higherLabel?: string;
  onChange?: (value: number) => void;
}) {
  const midPoint = min + (max - min) / 2;
  const [value, setValue] = React.useState(
    defaultValue === undefined ? midPoint : defaultValue
  );

  React.useEffect(() => onChange?.(value), [value]);

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const numeric = parseInt(event.target.value, 10);
      if (!isNaN(numeric)) {
        setValue(numeric);
      }
    },
    []
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="w-full p-2 border border-gray-300 rounded hover:border-gray-500">
        <input
          type="range"
          min={min}
          max={max}
          defaultValue={defaultValue}
          onChange={handleChange}
          className="w-full"
          id={id}
        />
        <div className="text-xs uppercase opacity-50 flex justify-between gap-8">
          <label htmlFor={id}>{lowerLabel}</label>
          <div className="font-bold">{value}</div>
          <label htmlFor={id}>{higherLabel}</label>
        </div>
      </div>
      <label htmlFor={id} className="uppercase opacity-50 text-lg w-full">
        {label}
      </label>
    </div>
  );
}
