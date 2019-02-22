import * as React from "react";
import { Query } from "react-apollo";
import foodSearchQuery from "queries/foods.search";

const debounce = require("lodash.debounce");

interface FoodAutocompleteComponentProps {
  input: string;
}

export default function FoodAutocomplete(
  props: FoodAutocompleteComponentProps
): React.ReactComponentElement<any> {
  const [wait, setWait] = React.useState(false),
    [term, setTerm] = React.useState(props.input);

  React.useEffect(() => {
    if (wait) return;
    setWait(true);
    setTimeout(() => {
      setWait(false);
      setTerm(props.input);
    }, 300);
  });

  return (
    <Query query={foodSearchQuery} variables={{ term, limit: 10, offset: 0 }}>
      {(foods: any) => {
        return !foods.data.searchFoods || !foods.data.searchFoods.length ? (
          false
        ) : (
          <div className="mt-4">test</div>
        );
      }}
    </Query>
  );
}
