import * as React from "react";
import Query from "components/Apollo/Query";
import foodReadQuery from "queries/foods.read";
import EditFood from "components/Food/EditFood";
import PageHeading from "components/Type/PageHeading";
import ContentContainer from "components/Containers/ContentContainer";

interface EditFoodProps {
  id: string;
}

export default function EditFoodPage(
  props: EditFoodProps
): React.ReactComponentElement<any> {
  return (
    <>
      <PageHeading>Edit Food</PageHeading>
      <ContentContainer>
        <Query query={foodReadQuery} variables={{ id: parseInt(props.id, 10) }}>
          {(props: any) => {
            if (!props.food) {
              return false;
            }
            return <EditFood {...props.food} />;
          }}
        </Query>
      </ContentContainer>
    </>
  );
}
