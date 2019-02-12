import * as React from "react";
import Query from "components/Apollo/Query";
import foodsQuery from "queries/foods";
import { RouteChildrenProps } from "react-router";
import Foods from "components/Food/Foods";
import PageHeading from "components/Type/PageHeading";
import ContentContainer from "components/Containers/ContentContainer";

export default function FoodLog(
  props: RouteChildrenProps
): React.ReactComponentElement<any> {
  return (
    <>
      <PageHeading>Food Log</PageHeading>
      <ContentContainer>
        <Query query={foodsQuery} pollInterval={60000}>
          {(props: any) => <Foods foods={props.foods} />}
        </Query>
      </ContentContainer>
      {/* <NewFoodEntry day={day} /> */}
    </>
  );
}
