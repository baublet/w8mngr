import * as React from "react";
import DeleteButton from "components/Button/DeleteButton";
import CloseIcon from "components/Icons/Close";
import { Mutation } from "react-apollo";
import deleteMeasurement from "queries/measurement.delete";
import readFood from "queries/foods.read";

interface DeleteMeasurementsProps {
  id: number;
  food_id: number;
}

export default function DeleteMeasurementsButton(
  props: DeleteMeasurementsProps
): React.ReactComponentElement<any> {
  return (
    <Mutation mutation={deleteMeasurement}>
      {deleteMeasurement => (
        <DeleteButton
          onClick={() => {
            deleteMeasurement({
              variables: {
                id: props.id,
                food_id: props.food_id
              },
              optimisticResponse: {
                __typename: "Mutation",
                deleteMeasurement: {
                  __typename: "Measurement",
                  id: props.id
                }
              },
              update: (proxy, { data: { deleteMeasurement } }) => {
                // Read the data from our cache for this query.
                const data: any = proxy.readQuery({
                  query: readFood,
                  variables: {
                    id: props.food_id
                  }
                });
                // Add our comment from the mutation to the end.
                data.food.measurements = data.food.measurements.filter(
                  (measurement: any) => measurement.id != props.id
                );
                // Write our data back to the cache.
                proxy.writeQuery({
                  query: readFood,
                  variables: {
                    id: props.food_id
                  },
                  data
                });
              }
            });
          }}
        >
          <CloseIcon />
          <span className="screen-reader-text">Delete measurement</span>
        </DeleteButton>
      )}
    </Mutation>
  );
}
