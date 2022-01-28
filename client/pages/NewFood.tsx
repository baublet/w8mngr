import React from "react";

import { BackToButton } from "../components/Button/BackTo";
import { NewFoodForm } from "../components/Foods";
import { FoodCircleIcon } from "../components/Icons/FoodCircle";
import { PageHeading } from "../components/Type/PageHeading";

export function NewFood() {
  return (
    <div className="flex flex-col gap-2 w-full">
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
