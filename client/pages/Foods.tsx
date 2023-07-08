import React from "react";

import { SecondaryButton } from "../components/Button/Secondary";
import { ContentContainer } from "../components/Containers/ContentContainer";
import { ContentLayout } from "../components/Containers/ContentLayout";
import { FoodsList } from "../components/Foods";
import { FoodCircleIcon } from "../components/Icons/FoodCircle";
import { PageHeading } from "../components/Type/PageHeading";

export function Foods() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <ContentContainer>
        <PageHeading icon={<FoodCircleIcon />}>Your Foods</PageHeading>
      </ContentContainer>
      <ContentContainer>
        <ContentLayout
          mainContent={<FoodsList />}
          sideContent={
            <SecondaryButton full to="/foods/new">
              New Food
            </SecondaryButton>
          }
        />
      </ContentContainer>
    </div>
  );
}
