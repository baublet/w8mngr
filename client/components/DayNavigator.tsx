import React from "react";
import cx from "classnames";
import { useParams, useHistory } from "react-router-dom";
import { addDays } from "date-fns";

import { formatDate } from "shared/dateFormat";
import { PrimaryIconButton } from "./Button/PrimaryIcon";
import { LeftIcon } from "./Icons/Left";
import { RightIcon } from "./Icons/Right";
import { dayStringFromDate } from "shared/dayStringFromDate";
import { dayStringToDate } from "shared/dayStringToDate";

export function DayNavigator({
  onChange,
  rootUrl,
}: {
  onChange: React.Dispatch<React.SetStateAction<string>>;
  rootUrl: string;
}) {
  const todayDayString = React.useMemo(() => dayStringFromDate(new Date()), []);

  const params = useParams<{ day: string }>();
  const { replace } = useHistory();

  const [dayString, setDayString] = React.useState(
    params.day || todayDayString
  );

  React.useEffect(() => {
    onChange(dayString);
  }, [dayString]);

  const dayDate = React.useMemo(() => dayStringToDate(dayString), [dayString]);
  const [isCurrentDayToday, setIsToday] = React.useState(() => {
    const todayString = dayStringFromDate(dayDate);
    return todayString === dayString;
  });

  React.useEffect(() => {
    const todayString = dayStringFromDate(new Date());
    if (todayString === dayString && !isCurrentDayToday) {
      setIsToday(true);
    } else if (todayString !== dayString && isCurrentDayToday) {
      setIsToday(false);
    }
  }, [dayString]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const todayString = dayStringFromDate(new Date());
      if (todayString === dayString && !isCurrentDayToday) {
        setIsToday(true);
      } else if (todayString !== dayString && isCurrentDayToday) {
        setIsToday(false);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [dayString]);

  const nextDay = React.useCallback(() => {
    const nextDay = addDays(dayStringToDate(dayString), 1);
    const nextDayString = dayStringFromDate(nextDay);
    setDayString(nextDayString);
    replace(`${rootUrl}${nextDayString}`);
  }, [dayString, rootUrl]);

  const prevDay = React.useCallback(() => {
    const prevDay = addDays(dayStringToDate(dayString), -1);
    const prevDayString = dayStringFromDate(prevDay);
    setDayString(prevDayString);
    replace(`${rootUrl}${prevDayString}`);
  }, [dayString, rootUrl]);

  const today = React.useCallback(() => {
    const today = dayStringFromDate(new Date());
    setDayString(today);
    replace(`${rootUrl}${today}`);
  }, []);

  return (
    <div className="flex items-stretch filter">
      <PrimaryIconButton
        className="rounded-l-large bg-green-600 text-green-50 px-4 py-4 rounded-r-none"
        onClick={prevDay}
      >
        <LeftIcon />
      </PrimaryIconButton>
      <button
        className={cx("bg-green-500 flex-grow flex justify-center items-center", {
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
