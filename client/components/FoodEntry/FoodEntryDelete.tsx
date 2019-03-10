import * as React from "react";
import { Mutation } from "react-apollo";
import deleteFoodEntryQuery from "shared/queries/foodEntry.delete";
import TransparentIconButton from "client/components/Button/TransparentIcon";
import CloseIcon from "client/components/Icons/Close";
import deleteFoodEntry from "./operations/delete";

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
      {deleteFoodEntryFn => (
        <TransparentIconButton
          className="absolute pin-r pin-t"
          onClick={() => {
            deleteFoodEntry(props.id, props.day, deleteFoodEntryFn);
          }}
        >
          <CloseIcon />
        </TransparentIconButton>
      )}
    </Mutation>
  );
}
