import React from "react";
import { useHistory, useParams } from "react-router";

import { EditActivityForm } from "../components/Activity";
import { BackToButton } from "../components/Button/BackTo";
import { HealthCircleIcon } from "../components/Icons/HealthCircle";
import { PageHeading } from "../components/Type/PageHeading";

export function EditActivity() {
  const { id } = useParams<{ id: string }>();
  const { goBack } = useHistory();
  return (
    <div className="flex flex-col gap-2 w-full">
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
  if (!document.referrer?.includes("/activities/" + id)) {
    return {
      to: "#",
      onClick: goBack,
    };
  }
  return { to: `/activities/${id}` };
}
