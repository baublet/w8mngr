import React from "react";
import { useHistory, useParams } from "react-router";

import { PageHeading } from "../components/Type/PageHeading";
import { BackToButton } from "../components/Button/BackTo";
import { HealthCircleIcon } from "../components/Icons/HealthCircle";
import { EditActivityForm } from "../components/Activity";

export function EditActivity() {
  const { id } = useParams<{ id: string }>();
  const { goBack } = useHistory();
  return (
    <div>
      <PageHeading
        icon={<HealthCircleIcon />}
        quickLinks={
          <>
            <BackToButton {...backButtonProps(id, goBack)}>
              View Activity
            </BackToButton>
          </>
        }
      >
        Edit Activity
      </PageHeading>
      <EditActivityForm id={id} />
    </div>
  );
}

function backButtonProps(id: string, goBack: () => void) {
  console.log({ ref: document.referrer });
  if (!document.referrer?.includes("/activities/")) {
    return {
      to: "#",
      onClick: goBack,
    };
  }
  return { to: `/activities/${id}` };
}
