import React from "react";
import { useRoute } from "wouter";

import { BackToButton } from "../components/Button/BackTo";
import { BackWithIconButton } from "../components/Button/BackWithIcon";
import { ContentContainer } from "../components/Containers/ContentContainer";
import { ContentLayout } from "../components/Containers/ContentLayout";
import { DayNavigator } from "../components/DayNavigator";
import { HealthCircleIcon } from "../components/Icons/HealthCircle";
import { PrimaryLoader } from "../components/Loading/Primary";
import { MuscleMap } from "../components/MuscleMap";
import { PageHeading } from "../components/Type/PageHeading";
import { useGetActivityLibraryActivityDetailsQuery } from "../generated";
import { useNavigateToUrl } from "../helpers/useNavigateToUrl";
import { ActivityLogUncontrolled } from "../components/ActivityLog/ActivityLogUncontrolled";
import { getWithDefault } from "../../shared/getWithDefault";
import { dayStringFromDate } from "../../shared/dayStringFromDate";

export function ActivityLibraryActivityLog() {
  const [, params] = useRoute("/activity-library/:id/log/:day?");
  const id = params?.id || "";
  const day = params?.day || dayStringFromDate(new Date());

  const { data, loading } = useGetActivityLibraryActivityDetailsQuery({
    variables: {
      id: id || "id",
    },
  });
  const activityLibraryActivity = data?.activityLibrary.edges[0].node;

  const navigate = useNavigateToUrl();
  const [stateDay, setDay] = React.useState(day);
  React.useEffect(() => {
    if (!stateDay) {
      return;
    }
    navigate(`/activity-library/${id}/log/${stateDay}`, { replace: true });
  }, [stateDay]);
  React.useEffect(() => {
    if (!day) {
      return;
    }
    setDay(day);
  }, [day]);

  const onRefresh = React.useCallback(() => {}, []);

  if (loading || !activityLibraryActivity) {
    return <PrimaryLoader />;
  }

  const logs = getWithDefault(
    data.activityLibrary.edges[0].node?.logs?.edges.map((e) => e.node),
    [],
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      <ContentContainer>
        <PageHeading
          icon={<HealthCircleIcon />}
          quickLinks={
            <div className="flex gap-2 md:gap-4 flex-wrap">
              <BackToButton to="/activity-library">
                Back to Library
              </BackToButton>
              <BackWithIconButton
                icon={<HealthCircleIcon />}
                to={`/activity-library/${activityLibraryActivity.id}`}
              >
                View Activity
              </BackWithIconButton>
            </div>
          }
        >
          {activityLibraryActivity.name || " "}
        </PageHeading>
      </ContentContainer>
      <ContentContainer>
        <ContentLayout
          mainContent={
            <div className="flex flex-col gap-8">
              <DayNavigator
                rootUrl={`/activity-library/${id}/log/`}
                onRefresh={onRefresh}
              />
              <ActivityLogUncontrolled
                activityType={activityLibraryActivity.type || "WEIGHT"}
                activityLibraryActivityId={activityLibraryActivity.id}
                day={day}
                logs={logs}
              />
            </div>
          }
          sideContent={
            <div className="flex-col gap-4 hidden lg:flex">
              <div>
                <MuscleMap
                  selected={activityLibraryActivity.muscleGroups}
                  showSummary
                />
              </div>
            </div>
          }
        />
      </ContentContainer>
    </div>
  );
}
