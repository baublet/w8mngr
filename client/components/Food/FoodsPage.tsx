import * as React from "react";
import Query from "client/components/Apollo/Query";
import foodsQuery from "shared/queries/foods";
import { RouteChildrenProps } from "react-router";
import Foods from "client/components/Food/Foods";
import PageHeading from "client/components/Type/PageHeading";
import ContentContainer from "client/components/Containers/ContentContainer";
import PrimaryButton from "client/components/Button/Primary";
import ApolloPaginatedQuery, { LoadMoreType } from "../Apollo/PaginatedQuery";
import OnVisible from "react-on-visible";

export default function FoodsPage(
  props: RouteChildrenProps
): React.ReactComponentElement<any> {
  return (
    <>
      <PageHeading
        quickLinks={<PrimaryButton to="/food/new">New Food</PrimaryButton>}
      >
        Foods
      </PageHeading>
      <ContentContainer>
        <ApolloPaginatedQuery query={foodsQuery} prop="foods">
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
