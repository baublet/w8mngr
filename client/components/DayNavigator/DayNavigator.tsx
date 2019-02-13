import * as React from "react";
import yesterday from "sharedHelpers/date/yesterday";
import tomorrow from "sharedHelpers/date/tomorrow";
import displayDate from "sharedHelpers/date/displayDate";
import LeftIcon from "components/Icons/Left";
import RightIcon from "components/Icons/Right";
import TransparentIconButton from "components/Button/TransparentIcon";

interface DayNavigatorProps {
  day: number;
  onTomorrow: () => void;
  onYesterday: () => void;
  onToday: () => void;
}

const buttonClasses = "rounded-none p-3 bg-secondaryDark";

export default function DayNavigator(
  props: DayNavigatorProps
): React.ReactComponentElement<any> {
  const displayToday = displayDate(props.day),
    displayTomorrow = displayDate(tomorrow(props.day)),
    displayYesterday = displayDate(yesterday(props.day));
  return (
    <div className="flex justify-around bg-secondary text-secondaryText my-3">
      <TransparentIconButton
        onClick={props.onYesterday}
        className={buttonClasses}
      >
        <LeftIcon />
        <span className="screen-reader-text">{displayYesterday}</span>
      </TransparentIconButton>
      <div
        onClick={props.onToday}
        className="flex-grow py-3 text-xs uppercase font-bold flex items-center justify-center"
      >
        {displayToday}
      </div>
      <TransparentIconButton
        onClick={props.onTomorrow}
        className={buttonClasses}
      >
        <RightIcon />
        <span className="screen-reader-text">{displayTomorrow}</span>
      </TransparentIconButton>
    </div>
  );
}
