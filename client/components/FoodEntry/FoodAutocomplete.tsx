import * as React from "react";
import { Query } from "react-apollo";
import foodSearchQuery from "shared/queries/foods.search";
import { FoodType } from "api/foods/types";
import AutocompleteFood from "client/components/Food/AutocompleteFood";

interface FoodAutocompleteComponentProps {
  input: string;
  handlePushFoodEntryData: (
    description: string,
    calories: string,
    fat: string,
    carbs: string,
    protein: string
  ) => void;
  handleAddFoodEntry: () => void;
}

export default function FoodAutocomplete(
  props: FoodAutocompleteComponentProps
): React.ReactComponentElement<any> {
  console.log("Render FoodAutocomplete");

  const [selectedFood, setSelectedFood] = React.useState(null),
    onClick = (id: number) => () => setSelectedFood(id);

  return (
    <Query
      query={foodSearchQuery}
      variables={{ term: props.input, limit: 10, offset: 0 }}
    >
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
                  handlePushFoodEntryData={props.handlePushFoodEntryData}
                  handleAddFoodEntry={props.handleAddFoodEntry}
                />
              )
            )}
          </div>
        );
      }}
    </Query>
  );
}
