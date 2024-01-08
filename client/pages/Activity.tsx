import React from "react";
import { useRoute } from "wouter";

import { dayStringFromDate } from "../../shared/dayStringFromDate";
import { ActivityDetails } from "../components/Activity/ActivityDetails";
import { ActivityStatsComponent } from "../components/Activity/ActivityStats";
import { BackToButton } from "../components/Button/BackTo";
import { SecondaryButton } from "../components/Button/Secondary";
import { SecondaryOutlineButton } from "../components/Button/SecondaryOutline";
import { ContentContainer } from "../components/Containers/ContentContainer";
import { ContentLayout } from "../components/Containers/ContentLayout";
import { HealthCircleIcon } from "../components/Icons/HealthCircle";
import { PrimaryLoader } from "../components/Loading/Primary";
import { PageHeading } from "../components/Type/PageHeading";
import { useGetActivityDetailsQuery } from "../generated";

export function Activity() {
  const [, params] = useRoute("/activities/:id");
  const id = params?.id || "no-id-in-url";
  const { data } = useGetActivityDetailsQuery({
    variables: {
      id,
    },
  });
  const todayDateString = React.useMemo(
    () => dayStringFromDate(new Date()),
    []
  );

  const activity = data?.currentUser?.activities.edges[0]?.node;

  if (!activity) {
    return <PrimaryLoader />;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <ContentContainer>
        <PageHeading
          icon={<HealthCircleIcon />}
          quickLinks={
            <BackToButton
              {...backButtonProps(() => {
                window.history.back();
              })}
            >
              Back to Activities
            </BackToButton>
          }
        >
          {activity.name}
        </PageHeading>
      </ContentContainer>
      <ContentContainer>
        <ContentLayout
          mainContent={<ActivityDetails data={data} />}
          sideContent={
            <div className="flex gap-4 flex-col">
              <SecondaryButton
                full
                to={`/activities/${id}/log/${todayDateString}`}
              >
                Log Activity
              </SecondaryButton>
              {activity.permissions.edit && (
                <SecondaryOutlineButton full to={`/activities/edit/${id}`}>
                  Edit Activity
                </SecondaryOutlineButton>
              )}
              <ActivityStatsComponent queryData={data} />
            </div>
          }
        />
      </ContentContainer>
    </div>
  );
}

function backButtonProps(goBack: () => void) {
  if (document.referrer?.includes("/activities?")) {
    return {
      to: "#",
      onClick: goBack,
    };
  }
  return { to: "/activities" };
}
