import React from "react";
import { Switch, Route } from "react-router-dom";

import { ContentContainer } from "../components/Containers/ContentContainer";
import { PageHeading } from "../components/Type/PageHeading";
import { FoodCircleIcon } from "../components/Icons/FoodCircle";
import { ContentLayout } from "../components/Containers/ContentLayout";
import { FoodsList } from "../components/Foods";
import { SecondaryButton } from "../components/Button/Secondary";

export function Foods() {
  return (
    <div>
      <PageHeading icon={<FoodCircleIcon />}>Your Foods</PageHeading>
      <ContentContainer>
        <ContentLayout
          mainContent={<FoodsList />}
          sideContent={<SecondaryButton full to="/foods/new">New Food</SecondaryButton>}
        />
      </ContentContainer>
    </div>
  );
}
