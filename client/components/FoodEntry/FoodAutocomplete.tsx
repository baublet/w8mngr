import * as React from "react";
import { Query } from "react-apollo";
import foodSearchQuery from "queries/foods.search";
import { FoodType } from "api/foods/types";
import AutocompleteFood from "components/Food/AutocompleteFood";

const debounce = require("lodash.debounce");

interface FoodAutocompleteComponentProps {
  input: string;
}

export default function FoodAutocomplete(
  props: FoodAutocompleteComponentProps
): React.ReactComponentElement<any> {
  const [wait, setWait] = React.useState(false),
    [term, setTerm] = React.useState(props.input),
    [selectedFood, setSelectedFood] = React.useState(null),
    onClick = (id: number) => () =>
      setSelectedFood(selectedFood == id ? null : id);

  React.useEffect(() => {
    if (wait) return;
    setWait(true);
    setTimeout(() => {
      setWait(false);
      setTerm(props.input);
    }, 750);
  });

  return (
    <Query query={foodSearchQuery} variables={{ term, limit: 10, offset: 0 }}>
      {(foods: any) => {
        return !foods.data.searchFoods || !foods.data.searchFoods.length ? (
          false
        ) : (
          <div className="mt-3">
            {foods.data.searchFoods.map((food: FoodType, index: number) =>
              !food.measurements.length ? (
                false
              ) : (
                <AutocompleteFood
                  {...food}
                  key={food.id}
                  onClick={onClick(food.id)}
                  showMeasurements={selectedFood == food.id}
                  index={index}
                />
              )
            )}
          </div>
        );
      }}
    </Query>
  );
}
