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
      <div className="flex flex-col text-center mx-auto max-w-md pointer-events-none">
        <div className="pt-4 border-t border-gray-50 mt-4 opacity-40 max-w-sm">
          Nothing here, yet! Get started by entering<br /> a food in the form below.
        </div>
        <div className="opacity-5"
          style={{
            fontSize: "200px",
          }}
        >
          <BricksIcon />
        </div>
      </div>
      <Spacer />
      <NewFoodLogPanel day={dayString} />
    </div>
  );
}
