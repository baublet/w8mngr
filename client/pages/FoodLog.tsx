import React from "react";
import { useParams } from "react-router";

import { dayStringFromDate } from "../../shared";
import { ContentContainer } from "../components/Containers/ContentContainer";
import { ContentLayout } from "../components/Containers/ContentLayout";
import { FoodLog as FoodLogComponent } from "../components/FoodLog";
import { PopularFoods } from "../components/Foods";
import { FoodCircleIcon } from "../components/Icons/FoodCircle";
import { PageHeading } from "../components/Type/PageHeading";

export function FoodLog() {
  const { day } = useParams<{ day?: string }>();
  const dayString = React.useMemo(() => {
    if (!day) {
      return dayStringFromDate(new Date());
    }
    return day;
  }, [day]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <ContentContainer>
        <PageHeading icon={<FoodCircleIcon />}>Food Log</PageHeading>
      </ContentContainer>
      <ContentContainer>
        <ContentLayout
          mainContent={<FoodLogComponent day={dayString} />}
          sideContent={<PopularFoods day={dayString} />}
        />
      </ContentContainer>
    </div>
  );
}
