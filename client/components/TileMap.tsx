import cx from "classnames";
import addDays from "date-fns/addDays";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import subDays from "date-fns/subDays";
import React from "react";
import { usePopper } from "react-popper";
import { Link } from "wouter";

import { dayStringFromDate } from "../../shared/dayStringFromDate";
import { dayStringToDate } from "../../shared/dayStringToDate";

const DAYS_IN_TILE_MAP = 378;

export function TileMap({
  data,
}: {
  data: {
    day: string;
    label: React.ReactNode;
    // 1-10
    intensity: number;
    link?: string;
  }[];
}) {
  const { dayColumns, maxDay, minDay, middleDay } = React.useMemo(() => {
    const todayDayString = dayStringFromDate(new Date());
    const todayDayNumber = parseInt(todayDayString, 10);
    let minDay: number = todayDayNumber;
    let maxDay: number = todayDayNumber;
    for (const dataPoint of data) {
      const dayInt = parseInt(dataPoint.day, 10);
      if (!minDay) {
        minDay = dayInt;
        continue;
      }
      if (!maxDay) {
        maxDay = dayInt;
        continue;
      }
      if (dayInt < minDay) {
        minDay = dayInt;
      }
      if (dayInt > maxDay) {
        maxDay = dayInt;
      }
    }

    const minDayString = `${minDay}`;
    const maxDayString = `${maxDay}`;

    const allDays = new Set<string>();

    let currentDayString = minDayString;
    while (currentDayString !== maxDayString) {
      allDays.add(currentDayString);
      currentDayString = dayStringFromDate(
        addDays(dayStringToDate(currentDayString), 1)
      );
    }

    allDays.add(maxDayString);

    // If there aren't a year's worth of data, pad the end until today
    let rightPadDate = dayStringToDate(maxDayString);
    while (allDays.size < DAYS_IN_TILE_MAP && !allDays.has(todayDayString)) {
      const nextDate = addDays(rightPadDate, 1);
      const nextDay = dayStringFromDate(nextDate);
      rightPadDate = nextDate;
      allDays.add(nextDay);
    }

    // If there aren't a year's worth of data, pad the beginning with days
    let leftPadDate = dayStringToDate(minDayString);
    while (allDays.size < DAYS_IN_TILE_MAP) {
      const previousDate = subDays(leftPadDate, 1);
      const previousDay = dayStringFromDate(previousDate);
      leftPadDate = previousDate;
      allDays.add(previousDay);
    }

    const dayColumns: string[][] = [];
    let columnIndex = 0;

    const allDaysArray = Array.from(allDays);
    allDaysArray.sort();

    for (let i = 0; i < allDaysArray.length; i++) {
      const day = allDaysArray[i];
      if (!dayColumns[columnIndex]) {
        dayColumns[columnIndex] = [];
      }

      const column = dayColumns[columnIndex];
      column.push(day);

      if (isSunday(day)) {
        columnIndex++;
      }
    }

    return {
      dayColumns,
      minDay: allDaysArray[0],
      maxDay: allDaysArray[allDaysArray.length - 1],
      middleDay: allDaysArray[Math.floor(allDaysArray.length / 2)],
    };
  }, [data]);

  const referenceElement = React.useRef<HTMLDivElement>(null);
  const popupElement = React.useRef<HTMLDivElement>(null);

  const { styles, attributes, forceUpdate } = usePopper(
    referenceElement?.current,
    popupElement?.current
  );
  const [showPopperElement, setShowPopperElement] = React.useState(false);
  const [hoveredDay, setHoveredDay] = React.useState<string | undefined>(
    undefined
  );
  const [locked, setLocked] = React.useState(false);

  const onClick = React.useCallback(() => {
    setLocked((locked) => !locked);
  }, []);

  const onMouseEnter = React.useCallback(() => {
    setShowPopperElement(true);
  }, []);

  const onMouseLeave = React.useCallback(() => {
    setLocked((locked) => {
      if (locked) {
        return locked;
      }
      setShowPopperElement(false);
      return locked;
    });
  }, []);

  const getOnHover = React.useCallback((day: string) => {
    return () => {
      setLocked((locked) => {
        if (locked) {
          return locked;
        }
        setHoveredDay(day);
        return locked;
      });
    };
  }, []);

  const selectedDayLabel = React.useMemo(() => {
    if (!hoveredDay) {
      return null;
    }
    const foundDay = data.find((d) => d.day === hoveredDay);
    if (!foundDay) {
      const date = dayStringToDate(hoveredDay);
      const dayOfTheWeek = format(date, "cccc");
      const displayDate = format(date, "PP");
      return `No logs on ${dayOfTheWeek}, ${displayDate}`;
    }
    return foundDay.label;
  }, [hoveredDay, locked]);

  React.useEffect(() => {
    forceUpdate?.();
  }, [showPopperElement]);

  return (
    <div>
      <div
        ref={popupElement}
        style={styles.popper}
        {...attributes.popper}
        className={cx(
          "rounded bg-slate-900 text-slate-50 p-4 shadow-lg text-xs",
          {
            hidden: !showPopperElement,
          }
        )}
      >
        <div key={hoveredDay}>{selectedDayLabel}</div>
      </div>
      <div className="flex flex-col gap-2 overflow-hidden overflow-x-auto">
        <div
          className="flex items-end justify-around min-w-fit"
          ref={referenceElement}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {dayColumns.map((days, i) => (
            <div
              className={cx("flex flex-col", {
                "self-start": i + 1 === dayColumns.length,
              })}
              key={`${i}`}
            >
              {days.map((day) => {
                const dayData = getDayData(data, day);
                return (
                  <Tile
                    day={day}
                    key={day}
                    intensity={dayData.intensity}
                    link={dayData.link}
                    onHover={getOnHover(day)}
                    onClick={onClick}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div
          className="flex justify-between text-xs text-slate-400"
          style={{
            width: referenceElement?.current?.scrollWidth,
          }}
        >
          <div>{format(dayStringToDate(`${minDay}`), "LLLL, yyyy")}</div>
          <div>{format(dayStringToDate(`${middleDay}`), "LLLL, yyyy")}</div>
          <div>{format(dayStringToDate(`${maxDay}`), "LLLL, yyyy")}</div>
        </div>
      </div>
    </div>
  );
}

function getDayData(
  data: {
    day: string;
    label: React.ReactNode;
    // 1-10
    intensity: number;
    link?: string;
  }[],
  day: string
): {
  day: string;
  label: React.ReactNode;
  // 1-10
  intensity: number;
  link: string;
} {
  const dayData = data.find((d) => d.day === day);
  if (!dayData) {
    return {
      day,
      intensity: 0,
      label: null,
      link: "#",
    };
  }

  if (!dayData.link) {
    dayData.link = "#";
  }

  return dayData as {
    day: string;
    label: React.ReactNode;
    intensity: number;
    link: string;
  };
}

function doNothing() {}

function Tile({
  day,
  intensity,
  link,
  onHover,
  onClick = doNothing,
}: {
  day: string;
  intensity: number;
  link: string;
  onHover: () => void;
  onClick?: () => void;
  label?: React.ReactNode;
}) {
  const { displayDate } = React.useMemo(() => {
    const displayDate = format(dayStringToDate(day), "PP");
    return {
      displayDate,
    };
  }, [day]);

  return (
    <Link
      to={link}
      onMouseOver={onHover}
      onClick={onClick}
      className={cx(
        "w-4 h-4 aspect-square cursor-pointer border rounded border-white hover:border-slate-900",
        {
          ["bg-slate-100"]: intensity <= 1,
          ["bg-emerald-100"]: intensity > 1 && intensity <= 3,
          ["bg-emerald-300"]: intensity > 3 && intensity <= 5,
          ["bg-emerald-500"]: intensity > 5 && intensity <= 7,
          ["bg-emerald-700"]: intensity > 7 && intensity <= 9,
          ["bg-emerald-800"]: intensity > 9,
        }
      )}
      title={displayDate}
    />
  );
}

function isSunday(day: string): boolean {
  const date = dayStringToDate(day);
  const dayOfTheWeek = getDay(date);
  return dayOfTheWeek === 0;
}
