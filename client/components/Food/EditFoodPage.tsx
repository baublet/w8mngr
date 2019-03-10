import * as React from "react";
import Query from "client/components/Apollo/Query";
import foodReadQuery from "shared/queries/foods.read";
import PageHeading from "client/components/Type/PageHeading";
import ContentContainer from "client/components/Containers/ContentContainer";
import updateFoodQuery from "shared/queries/foods.update";
import { Mutation } from "react-apollo";
import FoodForm, { FoodFormState } from "client/components/Food/FoodForm";
import SavedIcon from "client/components/Icons/Saved";
import updateFood from "./operations/update";

interface EditFoodProps {
  id: string;
}

export default function EditFoodPage(
  props: EditFoodProps
): React.ReactComponentElement<any> {
  const [loading, setLoading] = React.useState(false),
    [saved, setSaved] = React.useState(false);

  return (
    <>
      <PageHeading quickLinks={saved ? <SavedIcon /> : false}>
        Edit Food
      </PageHeading>
      <ContentContainer>
        <Query query={foodReadQuery} variables={{ id: parseInt(props.id, 10) }}>
          {(props: any) => {
            if (!props.food) {
              return false;
            }
            return (
              <Mutation mutation={updateFoodQuery}>
                {updateFoodFn => (
                  <FoodForm
                    id={props.food.id}
                    name={props.food.name}
                    description={props.food.description}
                    measurements={props.food.measurements}
                    loading={loading}
                    onChange={() => setSaved(false)}
                    onSave={(food: FoodFormState) => {
                      if (!loading) {
                        setLoading(true);
                      }
                      updateFood(food, setSaved, setLoading, updateFoodFn);
                    }}
                  />
                )}
              </Mutation>
            );
          }}
        </Query>
      </ContentContainer>
    </>
  );
}
