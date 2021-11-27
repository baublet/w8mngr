import React from "react";
import { useParams } from "react-router-dom";

import { PageHeading } from "../components/Type/PageHeading";
import { FoodCircleIcon } from "../components/Icons/FoodCircle";
import { EditFoodForm } from "../components/Foods";

export function EditFood() {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      <PageHeading icon={<FoodCircleIcon />}>Edit Food</PageHeading>
      <EditFoodForm id={id} />
    </div>
  );
}
