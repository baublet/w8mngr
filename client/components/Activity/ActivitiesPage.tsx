import * as React from "react";
import Query from "components/Apollo/Query";
import activitiesQuery from "queries/activities";
import { RouteChildrenProps } from "react-router";
import PageHeading from "components/Type/PageHeading";
import ContentContainer from "components/Containers/ContentContainer";
import PrimaryButton from "components/Button/Primary";
import ActivitiesListComponent from "components/Activity/Activities";

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
