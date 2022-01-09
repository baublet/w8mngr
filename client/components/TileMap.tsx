import React from "react";
import addDays from "date-fns/addDays";
import subDays from "date-fns/subDays";
import getDay from "date-fns/getDay";
import cx from "classnames";
import { Link } from "react-router-dom";
import format from "date-fns/format";
import { usePopper } from "react-popper";

import { dayStringFromDate, dayStringToDate } from "../../shared";

export function TileMap({
  data,
}: {
  data: {
    day: string;
    label: React.ReactNode;
    // 1-10
    intensity: number;
    link: string;
  }[];
}) {
  const { dayColumns, maxDay, minDay, middleDay } = React.useMemo(() => {
    let minDay: number | undefined;
    let maxDay: number | undefined;
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

    const allDays: string[] = [];

    let currentDayString = minDayString;
    while (currentDayString !== maxDayString) {
      allDays.push(currentDayString);
      currentDayString = dayStringFromDate(
        addDays(dayStringToDate(currentDayString), 1)
      );
    }

    allDays.push(maxDayString);

    // If there aren't a year's worth of data, pad the beginning until today
    const todayDayString = dayStringFromDate(new Date());
    while (
      allDays.length < 365 &&
      allDays[allDays.length - 1] !== todayDayString
    ) {
      const nextDay = dayStringFromDate(
        addDays(dayStringToDate(allDays[allDays.length - 1]), 1)
      );
      allDays.push(nextDay);
    }

    // If there aren't a year's worth of data, pad the past with days
    while (allDays.length < 380) {
      const previousDay = dayStringFromDate(
        subDays(dayStringToDate(allDays[0]), 1)
      );
      allDays.unshift(previousDay);
    }

    const dayColumns: string[][] = [];
    let columnIndex = 0;

    for (let i = 0; i < allDays.length; i++) {
      const day = allDays[i];
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
      minDay: allDays[0],
      maxDay: allDays[allDays.length - 1],
      middleDay: allDays[Math.floor(allDays.length / 2)]
    };
  }, [data]);

  const referenceElement = React.useRef<HTMLDivElement>(null);
  const popupElement = React.useRef<HTMLDivElement>(null);

  const { styles, attributes, forceUpdate } = usePopper(
    referenceElement?.current,
    popupElement?.current
  );
  const [showPopperElement, setShowPopperElement] = React.useState(false);
  const [label, setLabel] = React.useState<React.ReactNode>(null);

  React.useEffect(() => {
    forceUpdate?.();
  }, [showPopperElement]);

  return (
    <>
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
        {label}
      </div>
      <div className="flex flex-col gap-2 overflow-hidden overflow-x-auto">
        <div
          className="flex items-end justify-around min-w-fit"
          ref={referenceElement}
          onMouseEnter={() => setShowPopperElement(true)}
          onMouseLeave={() => setShowPopperElement(false)}
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
                    onHover={setLabel}
                    label={dayData.label}
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
    </>
  );
}

function getDayData(
  data: {
    day: string;
    label: React.ReactNode;
    // 1-10
    intensity: number;
    link: string;
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
  return dayData;
}
function Tile({
  day,
  intensity,
  link,
  onHover,
  label,
}: {
  day: string;
  intensity: number;
  link: string;
  onHover: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  label?: React.ReactNode;
}) {
  const { displayDate, displayLabel, onMouseOver } = React.useMemo(() => {
    const displayDate = format(dayStringToDate(day), "PP");
    return {
      displayDate,
      displayLabel: label || `No logs on ${displayDate}`,
      onMouseOver: () => onHover(displayLabel),
    };
  }, [day]);

  return (
    <Link
      to={link}
      onMouseOver={onMouseOver}
      className={cx(
        "w-4 h-4 aspect-square cursor-pointer border rounded border-white",
        {
          ["bg-slate-100"]: intensity <= 1,
          ["bg-emerald-100"]: intensity > 1 && intensity <= 3,
          ["bg-emerald-300"]: intensity > 3 && intensity <= 5,
          ["bg-emerald-500"]: intensity > 5 && intensity <= 7,
          ["bg-emerald-700"]: intensity > 7 && intensity <= 9,
          ["bg-emerald-900"]: intensity > 9,
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

function min(...numbers: (number | undefined)[]): number {
  let minimum: number | undefined = undefined;
  for (const num of numbers) {
    if (num === undefined) {
      continue;
    }
    if (minimum === undefined) {
      minimum = num;
      continue;
    }
    if (minimum > num) {
      minimum = num;
    }
  }
  return minimum ?? 0;
}
