import React from "react";
import { useParams } from "react-router";

import { ContentContainer } from "../components/Containers/ContentContainer";
import { PageHeading } from "../components/Type/PageHeading";
import { ContentLayout } from "../components/Containers/ContentLayout";
import { HealthCircleIcon } from "../components/Icons/HealthCircle";
import { ActivityLog as ActivityLogComponent } from "../components/ActivityLog";

import { useGetActivityDetailsQuery } from "../generated";
import { PrimaryLoader } from "../components/Loading/Primary";
import { BackToButton } from "../components/Button/BackTo";
import { MuscleMap } from "../components/MuscleMap";
import { IntensityScale } from "../components/Activity/IntensityScale";
import { ActivityStatsComponent } from "../components/ActivityLog/ActivityStats";

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
      <PageHeading
        icon={<HealthCircleIcon />}
        quickLinks={
          <>
            <BackToButton to="/activities">Back to Activities</BackToButton>
          </>
        }
      >
        <div className="flex gap-2 items-center">
          <IntensityScale intensity={activity.intensity} size="small" />
          {activity.name}
        </div>
      </PageHeading>
      <ContentContainer>
        <ContentLayout
          mainContent={
            <ActivityLogComponent
              activityId={activity.id}
              day={day}
              activityType={activity.type}
              underInput={<ActivityStatsComponent queryData={data} />}
            />
          }
          sideContent={
            <div className="flex flex-col gap-4">
              <div>
                <MuscleMap selected={activity.muscleGroups} showSummary />
              </div>
            </div>
          }
        />
      </ContentContainer>
    </div>
  );
}
