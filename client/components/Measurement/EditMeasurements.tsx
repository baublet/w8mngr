import * as React from "react";
import { MeasurementType } from "api/measurements/types";
import EditMeasurement from "./EditMeasurement";
import NewMeasurement from "./NewMeasurement";

interface EditMeasurementsProps {
  food_id: number;
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
      <NewMeasurement food_id={props.food_id} />
    </div>
  );
}
