import React from "react";

import { ContentContainer } from "../components/Containers/ContentContainer";
import { PageHeading } from "../components/Type/PageHeading";
import { ScaleIcon } from "../components/Icons/Scale";
import { ContentLayout } from "../components/Containers/ContentLayout";
import { WeightLog as WeightLogComponent } from "../components/WeightLog";

export function WeightLog() {
  return (
    <div>
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
