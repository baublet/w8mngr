import React from "react";

import { SecondaryButton } from "../components/Button/Secondary";
import { SecondaryOutlineButton } from "../components/Button/SecondaryOutline";
import { ContentContainer } from "../components/Containers/ContentContainer";
import { ContentLayout } from "../components/Containers/ContentLayout";
import { FoodCircleIcon } from "../components/Icons/FoodCircle";
import { PrimaryLoader } from "../components/Loading/Primary";
import { MacrosPieChart } from "../components/Nutrition/MacrosPieChart";
import { NutritionChart } from "../components/Nutrition/NutritionChart";
import { PageHeading } from "../components/Type/PageHeading";
import {
  useGetFoodLogStatsQuery,
  useGetCurrentUserWeightLogSummaryQuery,
} from "../generated";

export function Nutrition() {
  const { data } = useGetFoodLogStatsQuery();
  const { data: weightData } = useGetCurrentUserWeightLogSummaryQuery();

  const dataPoints = data?.currentUser?.foodLogStats.visualizationData;
  const weightDataPoints =
    weightData?.currentUser?.weightLogSummary.dailyAverage;
  const summary = data?.currentUser?.foodLogStats.summary;

  return (
    <div className="flex flex-col w-full gap-4">
      <ContentContainer>
        <PageHeading icon={<FoodCircleIcon />}>Nutrition Dashboard</PageHeading>
      </ContentContainer>
      <ContentContainer>
        <ContentLayout
          mainContent={
            dataPoints && summary && weightDataPoints ? (
              <NutritionChart
                data={dataPoints}
                summary={summary}
                weightData={weightDataPoints}
              />
            ) : (
              <PrimaryLoader />
            )
          }
          sideContent={
            <div className="flex flex-col gap-4">
              <SecondaryButton to="/foodlog" full>
                Food Log
              </SecondaryButton>
              <SecondaryOutlineButton to="/foods" full>
                Food Database
              </SecondaryOutlineButton>
              {!summary ? null : (
                <div className="flex flex-col gap-4">
                  <StatPanel>
                    <h4 className="font-thin text-base mb-4">Daily Macros</h4>
                    <MacrosPieChart
                      averageDailyCarbs={summary.averageDailyCarbs}
                      averageDailyFat={summary.averageDailyFat}
                      averageDailyProtein={summary.averageDailyProtein}
                    />
                  </StatPanel>
                </div>
              )}
            </div>
          }
        />
      </ContentContainer>
    </div>
  );
}

function StatPanel({ children }: React.PropsWithChildren<{}>) {
  return <div className="p-4 bg-slate-50 rounded">{children}</div>;
}
