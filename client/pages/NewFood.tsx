import React from "react";

import { PageHeading } from "../components/Type/PageHeading";
import { FoodCircleIcon } from "../components/Icons/FoodCircle";
import { NewFoodForm } from "../components/Foods";
import { BackToButton } from "../components/Button/BackTo";

export function NewFood() {
  return (
    <div>
      <PageHeading
        icon={<FoodCircleIcon />}
        quickLinks={
          <>
            <BackToButton to="/foods">Back to Foods</BackToButton>
          </>
        }
      >
        New Food
      </PageHeading>
      <NewFoodForm />
    </div>
  );
}
