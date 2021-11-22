import React from "react";

import { ContentLayout } from "../components/Containers/ContentLayout";
import { ContentContainer } from "../components/Containers/ContentContainer";
import { PageHeading } from "../components/Type/PageHeading";
import { SecondaryOutlineButton } from "../components/Button/SecondaryOutline";
import { SecondaryButton } from "../components/Button/Secondary";
import { Spacer } from "../components/Spacer";
import { FoodCircleIcon } from "../components/Icons/FoodCircle";

export function Nutrition() {
  return (
    <div>
      <PageHeading icon={<FoodCircleIcon />}>Nutrition</PageHeading>
      <ContentContainer>
        <ContentLayout
          mainContent={<>Placeholder</>}
          sideContent={
            <div>
              <SecondaryButton to="/foodlog" full>
                Food Log
              </SecondaryButton>
              <Spacer size="s" />
              <SecondaryOutlineButton to="/foods" full>
                Food Database
              </SecondaryOutlineButton>
            </div>
          }
        />
      </ContentContainer>
    </div>
  );
}