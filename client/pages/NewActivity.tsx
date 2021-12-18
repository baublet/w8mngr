import React from "react";

import { PageHeading } from "../components/Type/PageHeading";
import { BackToButton } from "../components/Button/BackTo";
import { HealthCircleIcon } from "../components/Icons/HealthCircle";
import { NewActivityForm } from "../components/Activity";

export function NewActivity() {
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
        New Activity
      </PageHeading>
      <NewActivityForm />
    </div>
  );
}
