import React from "react";
import { useRoute, useLocation } from "wouter";

import { EditActivityForm } from "../components/Activity/EditActivityForm";
import { BackToButton } from "../components/Button/BackTo";
import { ContentContainer } from "../components/Containers/ContentContainer";
import { HealthCircleIcon } from "../components/Icons/HealthCircle";
import { PageHeading } from "../components/Type/PageHeading";

export function EditActivity() {
  const [, params] = useRoute("/activities/edit/:id");
  const id = params?.id || "id";
  const [, setLocation] = useLocation();
  return (
    <div className="flex flex-col gap-4 w-full">
      <ContentContainer>
        <PageHeading
          icon={<HealthCircleIcon />}
          quickLinks={
            <BackToButton
              {...backButtonProps(id || "", () =>
                setLocation(`/activities/${id}`),
              )}
            >
              View Activity
            </BackToButton>
          }
        >
          Edit Activity
        </PageHeading>
      </ContentContainer>
      <ContentContainer>
        <EditActivityForm id={id} />
      </ContentContainer>
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
