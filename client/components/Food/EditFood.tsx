import * as React from "react";
import { FoodType } from "api/foods/types";
import Input from "components/Forms/Input";
import MultilineInput from "components/Forms/MultilineInput";
import PrimaryButton from "components/Button/Primary";
import DeleteButton from "components/Button/DeleteButton";
import { Mutation } from "react-apollo";
import { History } from "history";
import deleteFoodQuery from "queries/foods.delete";
import foodQuery from "queries/foods";
import { withRouter, RouteChildrenProps } from "react-router";

type BaseEditFoodType = FoodType & RouteChildrenProps;

interface FoodEditProps extends BaseEditFoodType {
  new?: boolean;
}

interface FoodEditState {
  name: string;
  description: string;
  [key: string]: string | number;
}

const Food = (props: FoodEditProps): React.ReactComponentElement<any> => {
  const initialState: FoodEditState = {
      name: props.name || "",
      description: props.description || ""
    },
    [values, setValues] = React.useState(initialState),
    onChange = (event: any) => {
      setValues({
        ...values,
        [event.target.name]: event.target.value
      });
    };
  return (
    <>
      <form
        onSubmit={e => {
          e.preventDefault();
        }}
      >
        <Input
          name={"name"}
          value={values.name}
          placeholder={"Name"}
          onChange={onChange}
          className="text-lg"
        />
        <MultilineInput
          name={"description"}
          value={values.description}
          placeholder={"Description"}
          onChange={onChange}
          className="mt-3"
        />
        <div className="flex flex-row-reverse mt-3">
          <PrimaryButton type="submit">Save</PrimaryButton>
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
        </div>
      </form>
    </>
  );
};

export default withRouter(Food);
