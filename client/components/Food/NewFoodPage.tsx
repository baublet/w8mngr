import * as React from "react";
import FoodForm, { FoodFormState } from "client/components/Food/FoodForm";
import PageHeading from "client/components/Type/PageHeading";
import ContentContainer from "client/components/Containers/ContentContainer";
import { Mutation } from "react-apollo";
import createFoodQuery from "shared/queries/foods.create";
import { History } from "history";
import createFood from "./operations/create";

interface EditFoodProps {
  id: string;
  history: History;
}

export default function NewFoodPage(
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
