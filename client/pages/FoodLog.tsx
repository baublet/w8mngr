import * as React from "react";
import Query from "client/components/Apollo/Query";
import foodLogQuery from "shared/queries/foodLog";
import shortDate from "shared/helpers/date/shortDate";
import yesterday from "shared/helpers/date/yesterday";
import tomorrow from "shared/helpers/date/tomorrow";
import DayNavigator from "client/components/DayNavigator/DayNavigator";
import { RouteChildrenProps } from "react-router";
import FoodEntries from "client/components/FoodEntry/FoodEntries";
import NewFoodEntry from "client/components/FoodEntry/NewFoodEntry";
import ContentContainer from "client/components/Containers/ContentContainer";

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
      <ContentContainer>
        <Query
          query={foodLogQuery}
          variables={{ day: values.today }}
          pollInterval={60000}
          hideLoader={true}
        >
          {(props: any) => (
            <FoodEntries foodEntries={props.foodEntries} day={values.today} />
          )}
        </Query>
      </ContentContainer>
      <NewFoodEntry day={day} />
    </>
  );
}
