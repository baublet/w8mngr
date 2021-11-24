import React from "react";
import { Switch, Route } from "react-router-dom";

import { ContentContainer } from "../components/Containers/ContentContainer";
import { PageHeading } from "../components/Type/PageHeading";
import { FoodCircleIcon } from "client/components/Icons/FoodCircle";
import { ContentLayout } from "client/components/Containers/ContentLayout";
import { FoodsList } from "../components/Foods";

export function Foods() {
  return (
    <div>
      <PageHeading icon={<FoodCircleIcon />}>Your Foods</PageHeading>
      <ContentContainer>
        <Switch>
          <Route>
            <ContentLayout mainContent={<FoodsList />} />
          </Route>
        </Switch>
      </ContentContainer>
    </div>
  );
}
