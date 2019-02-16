import * as React from "react";
import FoodForm from "components/Food/FoodForm";
import PageHeading from "components/Type/PageHeading";
import ContentContainer from "components/Containers/ContentContainer";
import { Mutation } from "react-apollo";
import createFoodQuery from "queries/foods.create";
import readFoodQuery from "queries/foods.read";
import foodsQuery from "queries/foods";
import { History } from "history";
import foods from "queries/foods";

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
          {createFood => (
            <FoodForm
              saveLabel="Create Food"
              onSave={(food: any) => {
                createFood({
                  variables: food,
                  update: (proxy, { data: { createFood } }) => {
                    if (!createFood || !createFood.id) {
                      return;
                    }
                    const data: any = proxy.readQuery({
                      query: foodsQuery
                    });
                    proxy.writeQuery({
                      query: foodsQuery,
                      data: {
                        foods: [...data.foods, createFood]
                      }
                    });
                    proxy.writeQuery({
                      query: readFoodQuery,
                      variables: { id: createFood.id },
                      data: {
                        food: createFood
                      }
                    });
                    props.history.replace(`/foods/${createFood.id}/edit`);
                  }
                });
              }}
            />
          )}
        </Mutation>
      </ContentContainer>
    </>
  );
}
