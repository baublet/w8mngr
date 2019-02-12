import * as React from "react";
import Query from "components/Apollo/Query";
import foodLogQuery from "queries/foodLog";
import shortDate from "sharedHelpers/date/shortDate";
import yesterday from "sharedHelpers/date/yesterday";
import tomorrow from "sharedHelpers/date/tomorrow";
import DayNavigator from "components/DayNavigator/DayNavigator";
import { RouteChildrenProps } from "react-router";
import FoodEntries from "components/FoodEntry/FoodEntries";
import NewFoodEntry from "components/FoodEntry/NewFoodEntry";

const get = require("lodash.get");

interface FoodLogState {
  today: number;
  yesterday: number;
  tomorrow: number;
}

export default function FoodLog(
  props: RouteChildrenProps
): React.ReactComponentElement<any> {
  const day = parseInt(get(props, ["match", "params", "day"], shortDate()), 10),
    initialState: FoodLogState = {
      today: day,
      yesterday: yesterday(day),
      tomorrow: tomorrow(day)
    };

  const [values, setValues] = React.useState(initialState);

  const onTomorrow = () => {
    const newToday = tomorrow(values.today);
    props.history.replace(`/foodlog/${newToday}`);
    setValues(
      Object.assign({
        ...values,
        today: newToday,
        yesterday: yesterday(newToday),
        tomorrow: tomorrow(newToday)
      })
    );
  };

  const onYesterday = () => {
    const newToday = yesterday(values.today);
    props.history.replace(`/foodlog/${newToday}`);
    setValues(
      Object.assign({
        ...values,
        today: newToday,
        yesterday: yesterday(newToday),
        tomorrow: tomorrow(newToday)
      })
    );
  };

  const onToday = () => {
    const newToday = shortDate();
    props.history.replace(`/foodlog/${newToday}`);
    if (newToday == values.today) {
      return;
    }
    setValues(
      Object.assign({
        ...values,
        today: newToday,
        yesterday: yesterday(newToday),
        tomorrow: tomorrow(newToday)
      })
    );
  };

  return (
    <>
      <DayNavigator
        day={values.today}
        onTomorrow={onTomorrow}
        onYesterday={onYesterday}
        onToday={onToday}
      />
      <div className="px-5 mt-3">
        <Query
          query={foodLogQuery}
          variables={{ day: values.today }}
          pollInterval={60000}
        >
          {(props: any) => (
            <FoodEntries foodEntries={props.foodEntries} day={day} />
          )}
        </Query>
      </div>
      <NewFoodEntry day={day} />
    </>
  );
}
