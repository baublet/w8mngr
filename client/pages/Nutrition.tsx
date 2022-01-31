import React from "react";

import { SecondaryButton } from "../components/Button/Secondary";
import { SecondaryOutlineButton } from "../components/Button/SecondaryOutline";
import { ContentContainer } from "../components/Containers/ContentContainer";
import { ContentLayout } from "../components/Containers/ContentLayout";
import { FoodCircleIcon } from "../components/Icons/FoodCircle";
import { PrimaryLoader } from "../components/Loading/Primary";
import { MacrosPieChart, NutritionChart } from "../components/Nutrition";
import { PageHeading } from "../components/Type/PageHeading";
import { useGetFoodLogStatsQuery } from "../generated";

export function Nutrition() {
  const { data } = useGetFoodLogStatsQuery();

  const dataPoints = data?.currentUser?.foodLogStats.visualizationData;
  const summary = data?.currentUser?.foodLogStats.summary;

  return (
    <div className="flex flex-col w-full gap-4">
      <ContentContainer>
        <PageHeading icon={<FoodCircleIcon />}>Nutrition Dashboard</PageHeading>
      </ContentContainer>
      <ContentContainer>
        <ContentLayout
          mainContent={
            dataPoints && summary ? (
              <NutritionChart data={dataPoints} summary={summary} />
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
                    <h4 className="font-thin text-base">
                      Average Daily Calories
                    </h4>
                    <div className="text-xs">
                      {Math.ceil(summary.averageDailyCalories).toLocaleString()}
                    </div>
                  </StatPanel>
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
