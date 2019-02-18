import * as React from "react";
import { MeasurementType } from "api/measurements/types";
import EditMeasurement from "./EditMeasurement";

interface EditMeasurementsProps {
  measurements: Array<MeasurementType>;
}

export default function EditMeasurements(
  props: EditMeasurementsProps
): React.ReactComponentElement<any> {
  return (
    <div className="mt-3">
      <h4>Measurements</h4>
      {props.measurements.map(measurement => (
        <EditMeasurement {...measurement} key={measurement.id} />
      ))}
      {/* <div>{props.amount}</div>
      <div className="flex-grow ml-2">{props.unit}</div>
      <div className="ml-2 text-center">
        {props.calories}
        <div className="uppercase opacity-50 text-xxs">Calories</div>
      </div>
      <div className="ml-2 text-center">
        {props.fat}
        <div className="uppercase opacity-50 text-xxs">Fat</div>
      </div>
      <div className="ml-2 text-center">
        {props.carbs}
        <div className="uppercase opacity-50 text-xxs">Carbs</div>
      </div>
      <div className="ml-2 text-center">
        {props.protein}
        <div className="uppercase opacity-50 text-xxs">Protein</div>
      </div> */}
    </div>
  );
}
