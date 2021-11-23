import React from "react";

import { DayNavigator } from "../DayNavigator";
import { NewFoodLogPanel } from "./NewFoodLogPanel";
import { Spacer } from "../Spacer";
import { LogEntry } from "./LogEntry";

import { dayStringFromDate, getWithDefault } from "../../../shared";
import { useGetCurrentUserFoodLogQuery } from "../../generated";

export function FoodLog() {
  const [dayString, setDayString] = React.useState<string>(() =>
    dayStringFromDate(new Date())
  );
  const { data, loading } = useGetCurrentUserFoodLogQuery({
    variables: {
      day: dayString,
    },
  });

  const entries = getWithDefault(data?.currentUser?.foodLog.edges, []).map(
    (edge) => edge.node
  );

  return (
    <div>
      <DayNavigator onChange={setDayString} rootUrl="/foodlog/" />
      <Spacer />
      {entries.length === 0 ? (
        <div className="flex flex-col max-w-md pointer-events-none">
          <div className="pt-4 border-t border-gray-50 mt-4 opacity-25 max-w-sm font-thin text-2xl">
            Nothing here, yet! Get started by entering a food in the form below.
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full gap-1">
          {entries.map((entry) => (
            <LogEntry key={entry.id} {...entry} day={dayString} />
          ))}
        </div>
      )}
      <Spacer />
      <NewFoodLogPanel day={dayString} />
    </div>
  );
}
