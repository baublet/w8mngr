import * as React from "react";
import { FoodType } from "api/foods/types";
import Panel from "components/Containers/Panel";

interface FoodDisplayType extends FoodType {
  index: number;
}

export default function Food(
  props: FoodDisplayType
): React.ReactComponentElement<any> {
  return (
    <Panel>
      <h4>{props.name}</h4>
    </Panel>
  );
}
