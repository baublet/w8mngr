import React from "react";

import { ContentContainer } from "../components/Containers/ContentContainer";
import { PageHeading } from "../components/Type/PageHeading";
import { FoodCircleIcon } from "../components/Icons/FoodCircle";
import { ContentLayout } from "../components/Containers/ContentLayout";
import { FoodLog as FoodLogComponent } from "../components/FoodLog";

export function FoodLog() {
  return (
    <div>
      <PageHeading icon={<FoodCircleIcon />}>Food Log</PageHeading>
      <ContentContainer>
        <ContentLayout mainContent={<FoodLogComponent />} />
      </ContentContainer>
    </div>
  );
}
