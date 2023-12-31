import React from "react";

import { BackToButton } from "../components/Button/BackTo";
import { ContentContainer } from "../components/Containers/ContentContainer";
import { NewFoodForm } from "../components/Foods/NewFoodForm";
import { FoodCircleIcon } from "../components/Icons/FoodCircle";
import { PageHeading } from "../components/Type/PageHeading";

export function NewFood() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <ContentContainer>
        <PageHeading
          icon={<FoodCircleIcon />}
          quickLinks={<BackToButton to="/foods">Back to Foods</BackToButton>}
        >
          New Food
        </PageHeading>
      </ContentContainer>
      <ContentContainer>
        <NewFoodForm />
      </ContentContainer>
    </div>
  );
}
