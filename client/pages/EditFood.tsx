import React from "react";
import { useParams } from "react-router-dom";

import { PageHeading } from "../components/Type/PageHeading";
import { FoodCircleIcon } from "../components/Icons/FoodCircle";
import { EditFoodForm } from "../components/Foods";
import { BackToButton } from "../components/Button/BackTo";

export function EditFood() {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return null;
  }
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
        Edit Food
      </PageHeading>
      <EditFoodForm id={id} />
    </div>
  );
}
