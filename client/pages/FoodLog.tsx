import React from "react";

import { ContentContainer } from "../components/Containers/ContentContainer";
import { PageHeading } from "../components/Type/PageHeading";
import { FoodLogIcon } from "client/components/Icons/FoodLog";
import { ContentLayout } from "client/components/Containers/ContentLayout";
import { FoodLog as FoodLogComponent } from "../components/FoodLog";

export function FoodLog() {
  return (
    <div>
      <PageHeading icon={<FoodLogIcon />}>Food Log</PageHeading>
      <ContentContainer>
        <ContentLayout mainContent={<FoodLogComponent />} />
      </ContentContainer>
    </div>
  );
}
