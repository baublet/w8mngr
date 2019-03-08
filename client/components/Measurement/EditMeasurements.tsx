import * as React from "react";
import { MeasurementType } from "api/measurements/types";
import EditMeasurement from "./EditMeasurement";
import NewMeasurement from "./NewMeasurement";
import EmptyNote from "client/components/Type/EmptyNote";

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
      {props.measurements.length ? (
        false
      ) : (
        <EmptyNote>
          No Measurments yet! This food will not display in the autocomplete
          until it has measurements. Add some using the form below.
        </EmptyNote>
      )}
      {props.measurements.map(measurement => (
        <EditMeasurement {...measurement} key={measurement.id} />
      ))}
      <NewMeasurement food_id={props.food_id} />
    </div>
  );
}
