import React from "react";
import cx from "classnames";

import { formatDate } from "shared/dateFormat";
import { PrimaryIconButton } from "./Button/PrimaryIcon";
import { LeftIcon } from "./Icons/Left";
import { RightIcon } from "./Icons/Right";

export function DayNavigator({
  prevDay,
  nextDay,
  today,
  isCurrentDayToday,
  dayDate,
}: {
  isCurrentDayToday: boolean;
  nextDay: () => void;
  today: () => void;
  prevDay: () => void;
  dayDate: Date;
}) {
  return (
    <div className="flex items-stretch">
      <PrimaryIconButton
        className="rounded-l-large bg-green-600 text-green-50 px-4 py-4 rounded-r-none"
        onClick={prevDay}
      >
        <LeftIcon />
      </PrimaryIconButton>
      <button
        className={cx("bg-green-500 flex-grow flex justify-center", {
          "pointer-events-none": isCurrentDayToday,
        })}
        type="button"
        onClick={today}
        title="Go to today"
      >
        <div className="relative text-green-50 px-4 py-2 text-center flex items-center justify-center">
          <div className="rounded absolute -bottom-5 bg-white px-2 py-1 text-xs text-green-900 text-opacity-50">
            {dayDate.getFullYear()}
          </div>
          {isCurrentDayToday ? null : (
            <div className="flex absolute text-xs -top-4 rounded-full bg-purple-600 px-2 py-1 shadow left-0">
              today
            </div>
          )}
          {formatDate.foodLog(dayDate)}
        </div>
      </button>
      <PrimaryIconButton
        className="rounded-r-large bg-green-600 text-green-50 px-4 py-4 rounded-l-none"
        onClick={nextDay}
      >
        <RightIcon />
      </PrimaryIconButton>
    </div>
  );
}
