import * as React from "react";
import { FoodType } from "api/foods/types";
import DeleteButton from "components/Button/DeleteButton";
import { Mutation } from "react-apollo";
import deleteFoodQuery from "queries/foods.delete";
import foodQuery from "queries/foods";
import { withRouter, RouteChildrenProps } from "react-router";

interface FoodDeleteProps extends RouteChildrenProps {
  id: number;
}

const FoodDeleteButton = (
  props: FoodDeleteProps
): React.ReactComponentElement<any> => {
  return (
    <Mutation mutation={deleteFoodQuery}>
      {deleteFood => (
        <DeleteButton
          className="mr-2"
          onClick={(e: any) => {
            e.preventDefault();
            props.history.replace("/foods");
            deleteFood({
              variables: { id: props.id },
              update: (proxy, { data: { deleteFood } }) => {
                // Read the data from our cache for this query.
                const data: any = proxy.readQuery({
                  query: foodQuery
                });
                proxy.writeQuery({
                  query: foodQuery,
                  data: {
                    foods: data.foods.filter(
                      (food: FoodType) => food.id !== props.id
                    )
                  }
                });
              }
            });
          }}
        >
          Delete
        </DeleteButton>
      )}
    </Mutation>
  );
};

export default withRouter(FoodDeleteButton);
