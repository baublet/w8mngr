import * as React from "react";
import Query from "client/components/Apollo/Query";
import activitiesQuery from "shared/queries/activities";
import { RouteChildrenProps } from "react-router";
import PageHeading from "client/components/Type/PageHeading";
import ContentContainer from "client/components/Containers/ContentContainer";
import PrimaryButton from "client/components/Button/Primary";
import ActivitiesListComponent from "client/components/Activity/Activities";

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
        <Query query={activitiesQuery}>
          {(props: any) => (
            <ActivitiesListComponent activities={props.activities} />
          )}
        </Query>
      </ContentContainer>
    </>
  );
}
