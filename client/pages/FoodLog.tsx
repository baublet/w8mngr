import React from "react";

import { ContentContainer } from "../components/Containers/ContentContainer";
import { ContentLayout } from "../components/Containers/ContentLayout";
import { FoodLog as FoodLogComponent } from "../components/FoodLog";
import { FoodCircleIcon } from "../components/Icons/FoodCircle";
import { PageHeading } from "../components/Type/PageHeading";

export function FoodLog() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <PageHeading icon={<FoodCircleIcon />}>Food Log</PageHeading>
      <ContentContainer>
        <ContentLayout mainContent={<FoodLogComponent />} />
      </ContentContainer>
    </div>
  );
}
