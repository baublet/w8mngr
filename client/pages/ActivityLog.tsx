import React from "react";
import { useParams } from "react-router";

import { ContentContainer } from "../components/Containers/ContentContainer";
import { PageHeading } from "../components/Type/PageHeading";
import { ContentLayout } from "../components/Containers/ContentLayout";
import { HealthCircleIcon } from "../components/Icons/HealthCircle";
import { ActivityLog as ActivityLogComponent } from "../components/ActivityLog";

import { useGetActivityDetailsQuery } from "../generated";
import { PrimaryLoader } from "../components/Loading/Primary";

export function ActivityLog() {
  const { id, day = "" } = useParams<{ id: string; day: string }>();
  const { data, loading } = useGetActivityDetailsQuery({
    variables: {
      id,
    },
  });
  const activity = data?.currentUser?.activities.edges[0].node;

  if (loading || !activity) {
    return <PrimaryLoader />;
  }

  return (
    <div>
      <PageHeading icon={<HealthCircleIcon />}>{activity.name}</PageHeading>
      <ContentContainer>
        <ContentLayout
          mainContent={
            <ActivityLogComponent
              activityId={activity.id}
              day={day}
              activityType={activity.type}
            />
          }
        />
      </ContentContainer>
    </div>
  );
}
