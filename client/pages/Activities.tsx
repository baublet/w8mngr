import React from "react";

import { ActivitiesTileMap } from "../components/Activity/ActivitiesTileMap";
import { ActivityList } from "../components/Activity/ActivityList";
import { ActivityPageHelpers } from "../components/Activity/ActivityPageHelpers";
import { SecondaryButton } from "../components/Button/Secondary";
import { ContentContainer } from "../components/Containers/ContentContainer";
import { ContentLayout } from "../components/Containers/ContentLayout";
import { FiltersPanel } from "../components/FiltersPanel";
import { Input } from "../components/Forms";
import { HealthCircleIcon } from "../components/Icons/HealthCircle";
import { PageHeading } from "../components/Type/PageHeading";

export function Activities() {
  const [searchString, setSearchString] = React.useState<string>();
  return (
    <div className="flex flex-col gap-8 w-full">
      <ContentContainer>
        <PageHeading icon={<HealthCircleIcon />}>Your Activities</PageHeading>
      </ContentContainer>
      <ContentContainer>
        <ContentLayout
          mainContent={
            <div className="flex flex-col gap-8">
              <div className="relative z-10">
                <ActivitiesTileMap />
              </div>
              <div>
                <ActivityPageHelpers />
              </div>
              <ActivityList searchString={searchString} />
            </div>
          }
          sideContent={
            <div className="flex flex-col gap-4">
              <SecondaryButton full to="/activities/new">
                New Activity
              </SecondaryButton>
              <FiltersPanel>
                <div>
                  <Input
                    type="text"
                    onChange={setSearchString}
                    value={searchString}
                    placeholder="Search String"
                    label="Search"
                  />
                </div>
              </FiltersPanel>
            </div>
          }
        />
      </ContentContainer>
    </div>
  );
}
