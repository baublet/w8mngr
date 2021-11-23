import React from "react";

import { useDayNavigatorState } from "./useDayNavigatorState";
import { DayNavigator } from "../DayNavigator";

export function FoodLog() {
  const { isCurrentDayToday, today, nextDay, prevDay, dayDate } =
    useDayNavigatorState();
  return (
    <div>
      <DayNavigator
        dayDate={dayDate}
        isCurrentDayToday={isCurrentDayToday}
        nextDay={nextDay}
        prevDay={prevDay}
        today={today}
      />
    </div>
  );
}
