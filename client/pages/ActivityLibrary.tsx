import React from "react";

import { ContentContainer } from "../components/Containers/ContentContainer";
import { ContentLayout } from "../components/Containers/ContentLayout";
import { FiltersPanel } from "../components/FiltersPanel";
import { Input } from "../components/Forms";
import { HealthCircleIcon } from "../components/Icons/HealthCircle";
import { PageHeading } from "../components/Type/PageHeading";
import { ActivityLibraryList } from "../components/ActivityLibrary/ActivityLibraryList";

export function ActivityLibrary() {
  const [searchString, setSearchString] = React.useState<string>();
  return (
    <div className="flex flex-col gap-8 w-full">
      <ContentContainer>
        <PageHeading icon={<HealthCircleIcon />}>Activity Library</PageHeading>
      </ContentContainer>
      <ContentContainer>
        <ContentLayout
          mainContent={
            <div className="flex flex-col gap-8">
              <ActivityLibraryList searchString={searchString} />
            </div>
          }
          sideContent={
            <div className="flex flex-col gap-4">
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
