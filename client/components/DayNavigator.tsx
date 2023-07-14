import cx from "classnames";
import { addDays, isPast } from "date-fns";
import React from "react";
import { useRoute } from "wouter";
import useLocation from "wouter/use-location";

import { or } from "../../shared";
import { formatDate } from "../../shared/dateFormat";
import { dayStringFromDate } from "../../shared/dayStringFromDate";
import { dayStringToDate } from "../../shared/dayStringToDate";
import { PrimaryIconButton } from "./Button/PrimaryIcon";
import { LeftIcon } from "./Icons/Left";
import { RightIcon } from "./Icons/Right";

export function DayNavigator({
  rootUrl,
  onRefresh = inert,
}: {
  onRefresh?: () => void;
  rootUrl: string;
}) {
  const todayDayString = React.useMemo(() => dayStringFromDate(new Date()), []);

  const [, params] = useRoute("/users/:day");
  const [, navigate] = useLocation();

  const [dayString, setDayString] = React.useState(
    or(params?.day, todayDayString)
  );

  const dayDate = React.useMemo(() => dayStringToDate(dayString), [dayString]);
  const [isCurrentDayToday, setIsToday] = React.useState(() => {
    const todayString = dayStringFromDate(dayDate);
    return todayString === dayString;
  });
  const isCurrentDayInPast = isPast(dayDate);

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
    navigate(`${rootUrl}${nextDayString}`, { replace: true });
  }, [dayString, rootUrl]);

  const prevDay = React.useCallback(() => {
    const prevDay = addDays(dayStringToDate(dayString), -1);
    const prevDayString = dayStringFromDate(prevDay);
    setDayString(prevDayString);
    navigate(`${rootUrl}${prevDayString}`, { replace: true });
  }, [dayString, rootUrl]);

  const today = React.useCallback(() => {
    const today = dayStringFromDate(new Date());
    setDayString(today);
    navigate(`${rootUrl}${today}`, { replace: true });
  }, []);

  return (
    <div className="flex items-stretch filter">
      <PrimaryIconButton
        className="rounded-l-large bg-emerald-600 text-emerald-50 px-4 py-4 rounded-r-none"
        onClick={prevDay}
      >
        <LeftIcon />
      </PrimaryIconButton>
      <button
        className={cx(
          "group bg flex-grow flex justify-center items-center bg-emerald-500"
        )}
        type="button"
        onClick={isCurrentDayToday ? onRefresh : today}
        title="Go to today"
      >
        <div className="relative text-slate-800 px-4 py-2 text-center flex items-center justify-center">
          <div className="rounded absolute -bottom-5 px-2 py-1 text-xs text-slate-400 text-opacity-50 bg-white">
            {dayDate.getFullYear()}
          </div>
          {isCurrentDayToday ? null : (
            <div className="flex absolute text-purple-50 text-xs -top-5 rounded-full bg-purple-600 px-2 py-1 shadow left-0 group-hover:bg-purple-500">
              {isCurrentDayInPast ? null : <>&#x2039;</>} go to today{" "}
              {isCurrentDayInPast ? <>&#x203A;</> : null}
            </div>
          )}
          <span className="font-bold text-emerald-50" onClick={onRefresh}>
            {formatDate.foodLog(dayDate)}
          </span>
        </div>
      </button>
      <PrimaryIconButton
        className="rounded-r-large bg-emerald-600 text-emerald-50 px-4 py-4 rounded-l-none"
        onClick={nextDay}
      >
        <RightIcon />
      </PrimaryIconButton>
    </div>
  );
}

function inert() {}
