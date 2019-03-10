import * as React from "react";
import DeleteButton from "client/components/Button/DeleteButton";
import { Mutation } from "react-apollo";
import deleteFoodQuery from "shared/queries/foods.delete";
import { withRouter, RouteChildrenProps } from "react-router";
import deleteFood from "./operations/delete";

interface FoodDeleteProps extends RouteChildrenProps {
  id: number;
}

const FoodDeleteButton = (
  props: FoodDeleteProps
): React.ReactComponentElement<any> => {
  return (
    <Mutation mutation={deleteFoodQuery}>
      {deleteFoodFn => (
        <DeleteButton
          className="mr-2"
          onClick={(e: any) => {
            e.preventDefault();
            deleteFood(props.id, props.history, deleteFoodFn);
          }}
        >
          Delete
        </DeleteButton>
      )}
    </Mutation>
  );
};

export default withRouter(FoodDeleteButton);
