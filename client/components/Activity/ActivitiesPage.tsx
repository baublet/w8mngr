import * as React from "react";
import activitiesQuery from "shared/queries/activities";
import { RouteChildrenProps } from "react-router";
import PageHeading from "client/components/Type/PageHeading";
import ContentContainer from "client/components/Containers/ContentContainer";
import PrimaryButton from "client/components/Button/Primary";
import ActivitiesListComponent from "client/components/Activity/Activities";
import ApolloPaginatedQuery, { LoadMoreType } from "../Apollo/PaginatedQuery";
import PrimaryLoader from "../Loading/Primary";
import OnVisible from "react-on-visible";

export default function ActivitiesPage(
  props: RouteChildrenProps
): React.ReactComponentElement<any> {
  return (
    <>
      <PageHeading
        quickLinks={
          <PrimaryButton to="/activity/new">New Activity</PrimaryButton>
        }
      >
        Activities
      </PageHeading>
      <ContentContainer>
        <ApolloPaginatedQuery query={activitiesQuery} prop="activities">
          {(props: any, loadMore: LoadMoreType) => (
            <>
              <ActivitiesListComponent activities={props.activities} />
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
