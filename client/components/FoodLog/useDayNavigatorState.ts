import React from "react";
import { addDays } from "date-fns";
import { useParams, useHistory } from "react-router-dom";

import { dayStringFromDate } from "../../../shared/dayStringFromDate";
import { dayStringToDate } from "../../../shared/dayStringToDate";

export function useDayNavigatorState({
  rootUrl = "/foodlog/",
}: {
  rootUrl?: string;
} = {}) {
  const todayDayString = React.useMemo(() => dayStringFromDate(new Date()), []);

  const params = useParams<{ day: string }>();
  const { replace } = useHistory();

  const [dayString, setDayString] = React.useState(
    params.day || todayDayString
  );

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

  return {
    dayString,
    nextDay,
    isCurrentDayToday,
    prevDay,
    dayDate,
    today,
  };
}
