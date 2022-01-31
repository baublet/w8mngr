import React from "react";
import { useParams } from "react-router-dom";

import { BackToButton } from "../components/Button/BackTo";
import { ContentContainer } from "../components/Containers/ContentContainer";
import { EditFoodForm } from "../components/Foods";
import { FoodCircleIcon } from "../components/Icons/FoodCircle";
import { PageHeading } from "../components/Type/PageHeading";

export function EditFood() {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return null;
  }
  return (
    <div className="flex flex-col gap-2 w-full">
      <ContentContainer>
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
      </ContentContainer>
      <ContentContainer>
        <EditFoodForm id={id} />
      </ContentContainer>
    </div>
  );
}
