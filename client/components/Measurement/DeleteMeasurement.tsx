import * as React from "react";
import DeleteButton from "components/Button/DeleteButton";
import CloseIcon from "components/Icons/Close";
import { Mutation } from "react-apollo";
import deleteMeasurementQuery from "queries/measurement.delete";
import deleteMeasurement from "operations/measurements/delete";

interface DeleteMeasurementsProps {
  id: number;
  food_id: number;
}

export default function DeleteMeasurementsButton(
  props: DeleteMeasurementsProps
): React.ReactComponentElement<any> {
  return (
    <Mutation mutation={deleteMeasurementQuery}>
      {deleteMeasurementFn => (
        <DeleteButton
          onClick={() =>
            deleteMeasurement(props.id, props.food_id, deleteMeasurementFn)
          }
        >
          <CloseIcon />
          <span className="screen-reader-text">Delete measurement</span>
        </DeleteButton>
      )}
    </Mutation>
  );
}
