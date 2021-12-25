import React from "react";

import { ContentContainer } from "../components/Containers/ContentContainer";
import { PageHeading } from "../components/Type/PageHeading";
import { ContentLayout } from "../components/Containers/ContentLayout";
import { SecondaryButton } from "../components/Button/Secondary";
import { HealthCircleIcon } from "../components/Icons/HealthCircle";
import { ActivityList } from "../components/Activity";

export function ActivityLog() {
  return (
    <div>
      <PageHeading icon={<HealthCircleIcon />}>Your Activities</PageHeading>
      <ContentContainer>
        <ContentLayout
          mainContent={<ActivityList />}
          sideContent={
            <SecondaryButton full to="/activities/new">
              New Activity
            </SecondaryButton>
          }
        />
      </ContentContainer>
    </div>
  );
}
