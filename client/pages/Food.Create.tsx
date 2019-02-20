import * as React from "react";
import FoodForm, { FoodFormState } from "components/Food/FoodForm";
import PageHeading from "components/Type/PageHeading";
import ContentContainer from "components/Containers/ContentContainer";
import { Mutation } from "react-apollo";
import createFoodQuery from "queries/foods.create";
import { History } from "history";
import createFood from "operations/foods/create";

interface EditFoodProps {
  id: string;
  history: History;
}

export default function CreateFoodPage(
  props: EditFoodProps
): React.ReactComponentElement<any> {
  return (
    <>
      <PageHeading>Create Food</PageHeading>
      <ContentContainer>
        <Mutation mutation={createFoodQuery}>
          {createFoodFn => (
            <FoodForm
              saveLabel="Create Food"
              onSave={(food: FoodFormState) => {
                createFood(food, props.history, createFoodFn);
              }}
            />
          )}
        </Mutation>
      </ContentContainer>
    </>
  );
}
