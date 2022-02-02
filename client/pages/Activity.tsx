import React from "react";
import { useHistory, useParams } from "react-router";

import { dayStringFromDate } from "../../shared";
import {
  ActivityDetails,
  ActivityStatsComponent,
} from "../components/Activity";
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
  const { id = "id" } = useParams<{ id?: string }>();
  const { goBack } = useHistory();
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
            <>
              <BackToButton {...backButtonProps(goBack)}>
                Back to Activities
              </BackToButton>
            </>
          }
        >
          {activity.name}
        </PageHeading>{" "}
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
