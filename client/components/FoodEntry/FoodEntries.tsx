import * as React from "react";
import Panel from "components/Panels/Panel";
import FoodEntry from "components/FoodEntry/FoodEntry";
import { FoodEntryType } from "api/foodEntries/types";

interface FoodEntriesProps {
  foodEntries: Array<FoodEntryType>;
  day: number;
}

let count = 0;

export default function FoodEntries(props: FoodEntriesProps) {
  return !props.foodEntries || !props.foodEntries.length ? (
    <b>No food entries today!</b>
  ) : (
    <Panel>
      {props.foodEntries.map((props: any, index: number) => (
        <div key={`${props.day}-${count++}`}>
          {index == 0 ? (
            false
          ) : (
            <div className="h-px bg-foreground opacity-10 my-3 -mx-3">
              &nbsp;
            </div>
          )}
          <FoodEntry {...props} />
        </div>
      ))}
    </Panel>
  );
}
