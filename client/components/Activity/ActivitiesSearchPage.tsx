import * as React from "react";
import searchActivitiesQuery from "shared/queries/activities.search";
import { RouteChildrenProps } from "react-router";
import PageHeading from "client/components/Type/PageHeading";
import ContentContainer from "client/components/Containers/ContentContainer";
import ActivitiesListComponent from "client/components/Activity/Activities";
import ApolloPaginatedQuery, { LoadMoreType } from "../Apollo/PaginatedQuery";
import OnVisible from "react-on-visible";
import { parse } from "query-string";
import PrimarySmallButton from "../Button/PrimaryButtonSmall";

export default function ActivitiesSearchPage(
  props: RouteChildrenProps
): React.ReactComponentElement<any> {
  const { term = "", muscle_groups = "" } = parse(props.location.search);
  return (
    <>
      <PageHeading
        quickLinks={
          <PrimarySmallButton to="/activity/new">
            New Activity
          </PrimarySmallButton>
        }
      >
        Activities
      </PageHeading>
      <ContentContainer>
        <ApolloPaginatedQuery
          query={searchActivitiesQuery}
          variables={{
            term,
            muscle_groups
          }}
          prop="searchActivities"
        >
          {(props: any, loadMore: LoadMoreType) => (
            <>
              <ActivitiesListComponent activities={props.searchActivities} />
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
