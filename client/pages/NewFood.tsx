import React from "react";

import { PageHeading } from "../components/Type/PageHeading";
import { FoodCircleIcon } from "../components/Icons/FoodCircle";
import { NewFoodForm } from "../components/Foods";

export function NewFood() {
  return (
    <div>
      <PageHeading icon={<FoodCircleIcon />}>New Food</PageHeading>
      <NewFoodForm />
    </div>
  );
}
