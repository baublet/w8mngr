import * as React from "react";
import Query from "components/Apollo/Query";
import foodReadQuery from "queries/foods.read";
import { RouteChildrenProps } from "react-router";
import Food from "components/Food/Food";
import PageHeading from "components/Type/PageHeading";
import ContentContainer from "components/Containers/ContentContainer";

export default function EditFood(
  props: RouteChildrenProps
): React.ReactComponentElement<any> {
  return (
    <>
      <PageHeading>Edit Log</PageHeading>
      <ContentContainer>
        <Query query={foodReadQuery} pollInterval={60000}>
          {(props: any) => <Food {...props} />}
        </Query>
      </ContentContainer>
    </>
  );
}
