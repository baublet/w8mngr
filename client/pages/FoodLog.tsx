import * as React from "react";
import Query from "components/Apollo/Query";
import foodLogQuery from "queries/foodLog";
import shortDate from "sharedHelpers/date/shortDate";
import yesterday from "sharedHelpers/date/yesterday";
import tomorrow from "sharedHelpers/date/tomorrow";
import DayNavigator from "components/DayNavigator/DayNavigator";
import { RouteChildrenProps } from "react-router";
import Input from "components/Forms/InputInverted";
import Button from "components/Button/GhostInverted";
import { Mutation } from "react-apollo";
import addFoodEntryQuery from "queries/foodEntryAdd";
import PanelInverted from "components/Panels/Inverted";
import FoodEntry from "components/FoodEntry";
import Panel from "components/Panels/Panel";

const get = require("lodash.get");

let count = 0;

interface FoodLogState {
  today: number;
  yesterday: number;
  tomorrow: number;
  description: string;
  calories: string;
  fat: string;
  carbs: string;
  protein: string;
  [key: string]: string | number;
}

export default function FoodLog(
  props: RouteChildrenProps
): React.ReactComponentElement<any> {
  const day = parseInt(get(props, ["match", "params", "day"], shortDate()), 10),
    initialState: FoodLogState = {
      today: day,
      yesterday: yesterday(day),
      tomorrow: tomorrow(day),
      description: "",
      calories: "",
      fat: "",
      carbs: "",
      protein: ""
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

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const InputComponent = (label: string, type: string = "number") => {
    const name = label.toLowerCase(),
      value = values[name];
    return (
      <Input
        label={label}
        placeholder={label}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
      />
    );
  };

  return (
    <Query
      query={foodLogQuery}
      variables={{ day: values.today }}
      pollInterval={60000}
    >
      {(props: any) => {
        return (
          <>
            <DayNavigator
              day={values.today}
              onTomorrow={onTomorrow}
              onYesterday={onYesterday}
              onToday={onToday}
            />
            <div className="mx-2 mt-3">
              {!props.foodEntries || !props.foodEntries.length ? (
                <b>No food entries today!</b>
              ) : (
                <Panel>
                  {props.foodEntries.map((props: any, index: number) => (
                    <div key={`${day}-${count++}`}>
                      {index == 0 ? (
                        false
                      ) : (
                        <div className="h-px bg-foreground opacity-25 my-3 -mx-3">
                          &nbsp;
                        </div>
                      )}
                      <FoodEntry {...props} key={`${day}-${count++}`} />
                    </div>
                  ))}
                </Panel>
              )}
            </div>
            <div>
              <Mutation
                mutation={addFoodEntryQuery}
                update={(cache, { data }) => {
                  setValues({
                    ...values,
                    description: "",
                    calories: "",
                    fat: "",
                    carbs: "",
                    protein: ""
                  });
                }}
              >
                {addFoodEntry => (
                  <PanelInverted className="mt-5 mx-2">
                    <h3 className="screen-reader-text">Add Food Entry</h3>
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        addFoodEntry({
                          variables: {
                            description: values.description,
                            calories: parseInt(values.calories),
                            fat: parseInt(values.fat),
                            carbs: parseInt(values.carbs),
                            protein: parseInt(values.protein),
                            day
                          }
                        });
                      }}
                    >
                      <Input
                        label="Description"
                        type="description"
                        name="description"
                        placeholder="e.g., cereal"
                        required
                        value={values.description}
                        onChange={onChange}
                      />
                      <div className="flex mt-2 w-full">
                        <div className="flex-grow">
                          {InputComponent("Calories")}
                        </div>
                        <div className="flex-grow ml-1">
                          {InputComponent("Fat")}
                        </div>
                        <div className="flex-grow ml-1">
                          {InputComponent("Carbs")}
                        </div>
                        <div className="flex-grow ml-1">
                          {InputComponent("Protein")}
                        </div>
                      </div>
                      <div className="mt-5 flex justify-end">
                        <Button type="submit">Add</Button>
                      </div>
                    </form>
                  </PanelInverted>
                )}
              </Mutation>
            </div>
          </>
        );
      }}
    </Query>
  );
}
