import React from "react";
import { useRoute } from "wouter";
import cx from "classnames";

import { SecondaryButton } from "../components/Button/Secondary";
import { ContentContainer } from "../components/Containers/ContentContainer";
import { ContentLayout } from "../components/Containers/ContentLayout";
import { HealthCircleIcon } from "../components/Icons/HealthCircle";
import { PageHeading } from "../components/Type/PageHeading";
import { useGetActivityLibraryActivitiesQuery } from "../generated";
import { PrimaryLoader } from "../components/Loading/Primary";
import { BackToButton } from "../components/Button/BackTo";
import { MuscleMap } from "../components/MuscleMap";
import { IntensityScale } from "../components/Activity/IntensityScale";
import { activityTypeToHumanReadable } from "../helpers/activityTypeToHumanReadable";
import { AsyncMarkdown } from "../components/Markdown";

export function ActivityLibraryActivity() {
  const [, params] = useRoute("/activity-library/:id");
  const id = params?.id || "";
  const { data, loading } = useGetActivityLibraryActivitiesQuery({
    variables: {
      input: {
        filter: {
          id,
        },
      },
    },
  });

  const activity = data?.activityLibrary.edges[0].node;

  if (!activity || loading) {
    return <PrimaryLoader />;
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      <ContentContainer>
        <PageHeading
          icon={<HealthCircleIcon />}
          quickLinks={
            <BackToButton to="/activity-library">
              Back to Activity Library
            </BackToButton>
          }
        >
          {activity.name || ""}
        </PageHeading>
      </ContentContainer>
      <ContentContainer>
        <ContentLayout
          mainContent={
            <div className="flex flex-col gap-8">
              <div className="flex flex-col sm:flex-row items-start gap-8 z-10">
                <div className="flex flex-col px-12 mx-auto">
                  <div className="w-48">
                    <MuscleMap
                      active={false}
                      selected={activity.muscleGroups}
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-around border-t sm:border-t-0 border-slate-200 w-full pt-8 sm:pt-0">
                  <div>
                    <div className="flex items-center mt-2 gap-4">
                      <div className="opacity-75 -ml-4">
                        <IntensityScale intensity={activity.intensity || 0} />
                      </div>
                      <div className="text-5xl font-thin">
                        {activity.intensity}
                      </div>
                      <div className="flex flex-col">
                        <div className="text-xs font-bold text-slate-400">
                          /&nbsp;10
                        </div>
                        <SubHeader>intensity</SubHeader>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center mt-2">
                      <div className="text-xl font-thin">
                        {activityTypeToHumanReadable(activity.type || "WEIGHT")}
                      </div>
                    </div>
                    <SubHeader>type</SubHeader>
                  </div>

                  {"exrx" in activity && typeof activity.exrx === "string" && (
                    <div className="opacity-75">
                      <div className="flex items-center mt-2">
                        <div className="text-xl font-thin">
                          <a href={activity.exrx}>exrx.net link</a>
                        </div>
                      </div>
                      <SubHeader>exrx</SubHeader>
                    </div>
                  )}
                </div>
              </div>

              {activity.description && (
                <div>
                  <AsyncMarkdown content={activity.description} />
                </div>
              )}
            </div>
          }
          sideContent={
            <div className="flex flex-col gap-4">
              <SecondaryButton full to={`/activity-library/${activity.id}/log`}>
                Log Activity
              </SecondaryButton>
            </div>
          }
        />
      </ContentContainer>
    </div>
  );
}

function SubHeader({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cx("font-bold text-sm opacity-20", className)}>
      {children}
    </div>
  );
}
