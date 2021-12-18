import React from "react";
import { useParams } from "react-router";

import { PageHeading } from "../components/Type/PageHeading";
import { BackToButton } from "../components/Button/BackTo";
import { HealthCircleIcon } from "../components/Icons/HealthCircle";
import { EditActivityForm } from "../components/Activity";

export function EditActivity() {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      <PageHeading
        icon={<HealthCircleIcon />}
        quickLinks={
          <>
            <BackToButton to={`/activities/${id}`}>View Activity</BackToButton>
          </>
        }
      >
        Edit Activity
      </PageHeading>
      <EditActivityForm id={id} />
    </div>
  );
}
