import * as React from "react";
import yesterday from "sharedHelpers/date/yesterday";
import tomorrow from "sharedHelpers/date/tomorrow";
import displayDate from "sharedHelpers/date/displayDate";

interface DayNavigatorProps {
  day: number;
  onTomorrow: () => void;
  onYesterday: () => void;
  onToday: () => void;
}

const buttonClasses = "p-3 bg-secondaryDark";

export default function DayNavigator(
  props: DayNavigatorProps
): React.ReactComponentElement<any> {
  const displayToday = displayDate(props.day),
    displayTomorrow = displayDate(tomorrow(props.day)),
    displayYesterday = displayDate(yesterday(props.day));
  return (
    <div className="flex justify-around bg-secondary text-secondaryText">
      <button onClick={props.onYesterday} className={buttonClasses}>
        <span>&larr;</span>
        <span className="screen-reader-text">{displayYesterday}</span>
      </button>
      <div
        onClick={props.onToday}
        className="flex-grow py-3 text-xs uppercase font-bold flex items-center justify-center"
      >
        {displayToday}
      </div>
      <button onClick={props.onTomorrow} className={buttonClasses}>
        <span>&rarr;</span>
        <span className="screen-reader-text">{displayTomorrow}</span>
      </button>
    </div>
  );
}
