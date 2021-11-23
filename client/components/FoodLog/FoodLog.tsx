import React from "react";

import { DayNavigator } from "../DayNavigator";
import { NewFoodLogPanel } from "./NewFoodLogPanel";
import { Spacer } from "../Spacer";

import { dayStringFromDate } from "../../../shared/dayStringFromDate";
import { BricksIcon } from "../Icons/Bricks";

export function FoodLog() {
  const [dayString, setDayString] = React.useState<string>(() =>
    dayStringFromDate(new Date())
  );
  return (
    <div>
      <DayNavigator onChange={setDayString} rootUrl="/foodlog/" />
      <Spacer />
      <div className="flex flex-col max-w-md pointer-events-none">
        <div className="pt-4 border-t border-gray-50 mt-4 opacity-25 max-w-sm font-thin text-2xl">
          Nothing here, yet! Get started by entering a food in the form below.
        </div>
      </div>
      <Spacer />
      <NewFoodLogPanel day={dayString} />
    </div>
  );
}
