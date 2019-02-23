import * as React from "react";
import { FoodType } from "api/foods/types";
import Input from "components/Forms/Input";

interface AutocompleteFoodComponentProps extends FoodType {
  key: number;
  onClick: () => void;
  showMeasurements: boolean;
  index: number;
}

export default function AutocompleteFood(
  props: AutocompleteFoodComponentProps
): React.ReactComponentElement<any> {
  return (
    <div
      className={`
        -mx-3 p-2 text-xs border-primaryTextSlight border-b
        ${!props.showMeasurements ? "" : "bg-primaryLight"}
        ${props.index > 0 ? "" : "border-t"}
      `}
      onClick={props.onClick}
    >
      <b>{props.name}</b>
      <div className="mt-1">
        {!props.showMeasurements
          ? false
          : props.measurements.map(measurement => (
              <div className="flex justify-around" key={measurement.id}>
                <div className="w-12">{measurement.amount}</div>
                <div className="w-24">{measurement.unit}</div>
                <div className="flex-grow">{measurement.calories}</div>
                <div className="flex-grow">{measurement.fat}</div>
                <div className="flex-grow">{measurement.carbs}</div>
                <div className="flex-grow">{measurement.protein}</div>
              </div>
            ))}
      </div>
    </div>
  );
}
