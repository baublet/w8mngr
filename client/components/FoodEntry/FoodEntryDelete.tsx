import * as React from "react";
import PrimaryIcon from "components/Button/PrimaryIcon";
import { Mutation } from "react-apollo";
import deleteFoodEntryQuery from "queries/foodEntryDelete";
import foodLogQuery from "queries/foodLog";
import { FoodEntryType } from "api/foodEntries/types";

interface FoodEntryDeleteProps {
  id: number;
  day: number;
}

export default function FoodEntryDelete(
  props: FoodEntryDeleteProps
): React.ReactComponentElement<any> {
  if (props.id == -1) return null;
  return (
    <Mutation mutation={deleteFoodEntryQuery}>
      {deleteFoodEntry => (
        <PrimaryIcon
          className="absolute pin-r pin-t"
          onClick={e => {
            deleteFoodEntry({
              variables: { id: props.id },
              update: (proxy, { data: { deleteFoodEntry } }) => {
                // Read the data from our cache for this query.
                const data: any = proxy.readQuery({
                  query: foodLogQuery,
                  variables: { day: props.day }
                });
                proxy.writeQuery({
                  query: foodLogQuery,
                  variables: { day: props.day },
                  data: {
                    foodEntries: data.foodEntries.filter(
                      (entry: FoodEntryType) => entry.id !== props.id
                    )
                  }
                });
              }
            });
          }}
        >
          &times;
        </PrimaryIcon>
      )}
    </Mutation>
  );
}
