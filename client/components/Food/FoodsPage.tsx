import * as React from "react";
import foodsQuery from "shared/queries/foods";
import { RouteChildrenProps } from "react-router";
import Foods from "client/components/Food/Foods";
import PageHeading from "client/components/Type/PageHeading";
import ContentContainer from "client/components/Containers/ContentContainer";
import Button from "client/components/Button/PrimaryButtonSmall";
import ApolloPaginatedQuery, { LoadMoreType } from "../Apollo/PaginatedQuery";
import OnVisible from "react-on-visible";
import { FoodType } from "api/foods/types";

interface FoodsQueryResultType {
  food: Array<FoodType>;
}

export default function FoodsPage(
  props: RouteChildrenProps
): React.ReactComponentElement<any> {
  return (
    <>
      <PageHeading quickLinks={<Button to="/food/new">New Food</Button>}>
        Foods
      </PageHeading>
      <ContentContainer>
        <ApolloPaginatedQuery query={foodsQuery}>
          {(props: any, loadMore: LoadMoreType) => (
            <>
              <Foods foods={props.foods} />
              {!loadMore ? (
                false
              ) : (
                <OnVisible
                  onChange={(visible: boolean) => {
                    if (visible && loadMore) loadMore();
                  }}
                >
                  <div />
                </OnVisible>
              )}
            </>
          )}
        </ApolloPaginatedQuery>
      </ContentContainer>
    </>
  );
}
