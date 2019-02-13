import * as React from "react";
import Panel from "components/Containers/Panel";
import FoodEntry from "components/FoodEntry/FoodEntry";
import { FoodEntryType } from "api/foodEntries/types";
import EmptyNote from "components/Type/EmptyNote";

interface FoodEntriesProps {
  foodEntries: Array<FoodEntryType>;
  day: number;
}

let count = 0;

export default function FoodEntries(props: FoodEntriesProps) {
  const Metric = (label: string) => {
    const key = label.toLowerCase(),
      amount = props.foodEntries.reduce(
        (value: number, foodEntry: any) => value + foodEntry[key],
        0
      );
    return (
      <div>
        <div className="text-2xl font-thin">{amount}</div>
        <div className="text-xxs uppercase opacity-50">{label}</div>
      </div>
    );
  };

  return !props.foodEntries || !props.foodEntries.length ? (
    <EmptyNote>
      No food entries today! Use the form below to begin tracking.
    </EmptyNote>
  ) : (
    <>
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
      <div className="flex text-center justify-around mt-5">
        {Metric("Calories")}
        {Metric("Fat")}
        {Metric("Carbs")}
        {Metric("Protein")}
      </div>
    </>
  );
}
