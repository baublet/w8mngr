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

export default function DayNavigator(
  props: DayNavigatorProps
): React.ReactComponentElement<any> {
  const displayToday = displayDate(props.day),
    displayTomorrow = displayDate(tomorrow(props.day)),
    displayYesterday = displayDate(yesterday(props.day));
  return (
    <div>
      <i onClick={props.onYesterday}>before</i>
      <b onClick={props.onToday}>{displayToday}</b>
      <i onClick={props.onTomorrow}>after</i>
    </div>
  );
}
