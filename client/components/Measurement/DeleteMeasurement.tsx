import * as React from "react";
import DeleteButton from "client/components/Button/DeleteButton";
import CloseIcon from "client/components/Icons/Close";
import { Mutation } from "react-apollo";
import deleteMeasurementQuery from "shared/queries/measurement.delete";
import deleteMeasurement from "client/operations/measurements/delete";

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
