import React from "react";

import { ContentContainer } from "../components/Containers/ContentContainer";
import { ContentLayout } from "../components/Containers/ContentLayout";
import { ScaleIcon } from "../components/Icons/Scale";
import { PageHeading } from "../components/Type/PageHeading";
import { WeightLog as WeightLogComponent } from "../components/WeightLog";

export function WeightLog() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <PageHeading
        icon={
          <div className="transform scale-75 translate-x-1">
            <ScaleIcon />
          </div>
        }
      >
        Weight Log
      </PageHeading>
      <ContentContainer>
        <ContentLayout mainContent={<WeightLogComponent />} />
      </ContentContainer>
    </div>
  );
}
