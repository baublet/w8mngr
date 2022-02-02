import React from "react";

import { NewActivityForm } from "../components/Activity";
import { BackToButton } from "../components/Button/BackTo";
import { ContentContainer } from "../components/Containers/ContentContainer";
import { HealthCircleIcon } from "../components/Icons/HealthCircle";
import { PageHeading } from "../components/Type/PageHeading";

export function NewActivity() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <ContentContainer>
        <PageHeading
          icon={<HealthCircleIcon />}
          quickLinks={
            <>
              <BackToButton to="/activities">Back to Activities</BackToButton>
            </>
          }
        >
          New Activity
        </PageHeading>
      </ContentContainer>
      <ContentContainer>
        <NewActivityForm />
      </ContentContainer>
    </div>
  );
}
