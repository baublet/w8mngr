import React from "react";
import { useParams, useHistory } from "react-router";

import { ContentContainer } from "../components/Containers/ContentContainer";
import { PageHeading } from "../components/Type/PageHeading";
import { ContentLayout } from "../components/Containers/ContentLayout";
import { SecondaryButton } from "../components/Button/Secondary";
import { HealthCircleIcon } from "../components/Icons/HealthCircle";
import { ActivityDetails } from "../components/Activity";
import { PrimaryLoader } from "../components/Loading/Primary";
import { useGetActivityDetailsQuery } from "../generated";
import { BackToButton } from "../components/Button/BackTo";
import { SecondaryOutlineButton } from "../components/Button/SecondaryOutline";
import { Spacer } from "../components/Spacer";

import { dayStringFromDate } from "../../shared";

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
    <div>
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
      </PageHeading>
      <ContentContainer>
        <ContentLayout
          mainContent={<ActivityDetails activity={activity} />}
          sideContent={
            <>
              <SecondaryButton full to={`/activities/edit/${id}`}>
                Edit Activity
              </SecondaryButton>
              <Spacer size="s" />
              <SecondaryOutlineButton
                full
                to={`/activities/${id}/log/${todayDateString}`}
              >
                Log Activity
              </SecondaryOutlineButton>
            </>
          }
        />
      </ContentContainer>
    </div>
  );
}

function backButtonProps(goBack: () => void) {
  console.log({ ref: document.referrer });
  if (!document.referrer?.includes("/activities?")) {
    return {
      to: "#",
      onClick: goBack,
    };
  }
  return { to: "/activities" };
}
