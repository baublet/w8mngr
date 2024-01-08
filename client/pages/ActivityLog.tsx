import React from "react";
import { useRoute } from "wouter";

import { ActivityStatsComponent } from "../components/Activity/ActivityStats";
import { ActivityLog as ActivityLogComponent } from "../components/ActivityLog/ActivityLog";
import { BackToButton } from "../components/Button/BackTo";
import { BackWithIconButton } from "../components/Button/BackWithIcon";
import { ContentContainer } from "../components/Containers/ContentContainer";
import { ContentLayout } from "../components/Containers/ContentLayout";
import { DayNavigator } from "../components/DayNavigator";
import { HealthCircleIcon } from "../components/Icons/HealthCircle";
import { PrimaryLoader } from "../components/Loading/Primary";
import { MuscleMap } from "../components/MuscleMap";
import { PageHeading } from "../components/Type/PageHeading";
import { useGetActivityDetailsQuery } from "../generated";
import { useNavigateToUrl } from "../helpers/useNavigateToUrl";

export function ActivityLog() {
  const [, params] = useRoute("/activities/:id/log/:day?");
  const id = params?.id || ""
  const day = params?.day || ""

  const { data, loading } = useGetActivityDetailsQuery({
    variables: {
      id: id || "id",
    },
  });
  const activity = data?.currentUser?.activities.edges[0].node;

  const navigate = useNavigateToUrl();
  const [stateDay, setDay] = React.useState(day);
  React.useEffect(() => {
    if (!stateDay) {
      return;
    }
    navigate(`/activities/${id}/log/${stateDay}`, { replace: true });
  }, [stateDay]);
  React.useEffect(() => {
    if (!day) {
      return;
    }
    setDay(day);
  }, [day]);

  const onRefresh = React.useCallback(() => {}, []);

  if (loading || !activity) {
    return <PrimaryLoader />;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <ContentContainer>
        <PageHeading
          icon={<HealthCircleIcon />}
          quickLinks={
            <div className="flex gap-4">
              <BackToButton to="/activities">Back to Activities</BackToButton>
              <BackWithIconButton
                icon={<HealthCircleIcon />}
                to={`/activities/${activity.id}`}
              >
                View Activity
              </BackWithIconButton>
            </div>
          }
        >
          {activity.name}
        </PageHeading>
      </ContentContainer>
      <ContentContainer>
        <ContentLayout
          mainContent={
            <div className="flex flex-col gap-4">
              <DayNavigator
                rootUrl={`/activities/${id}/log/`}
                onRefresh={onRefresh}
              />
              <ActivityLogComponent
                activityId={activity.id}
                day={day}
                activityType={activity.type}
                underInput={<ActivityStatsComponent queryData={data} />}
              />
            </div>
          }
          sideContent={
            <div className="flex-col gap-4 hidden lg:flex">
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
