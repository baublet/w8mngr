import React from "react";
import cx from "classnames";
import { useParams } from "react-router";

import { DayNavigator } from "../DayNavigator";
import { NewFoodLogPanel } from "./NewFoodLogPanel";
import { Spacer } from "../Spacer";
import { LogEntry } from "./LogEntry";
import { PrimaryLoader } from "../Loading/Primary";
import { FoodSearchAutocomplete } from "./FoodSearchAutocomplete";
import type { NewFoodLogFormObject } from "./NewFoodLogPanel";

import { dayStringFromDate, getWithDefault } from "../../../shared";
import { useGetCurrentUserFoodLogQuery } from "../../generated";

const columns: ["calories", "fat", "carbs", "protein"] = [
  "calories",
  "fat",
  "carbs",
  "protein",
];

export function FoodLog() {
  const { day } = useParams<{ day?: string }>();
  const dayString = React.useMemo(() => {
    if (!day) {
      return dayStringFromDate(new Date());
    }
    return day;
  }, [day]);

  const { data } = useGetCurrentUserFoodLogQuery({
    fetchPolicy: "network-only",
    variables: {
      day: dayString,
    },
  });
  const [searchTerm, setSearchTerm] = React.useState("");
  const newFoodLogFormObjectRef = React.useRef<
    NewFoodLogFormObject | undefined
  >(undefined);
  const newFoodLogDescriptionInputRef = React.useRef<HTMLInputElement | null>(
    null
  );

  const loading = !Boolean(data?.currentUser?.foodLog);

  const entries = getWithDefault(data?.currentUser?.foodLog.edges, []).map(
    (edge) => edge.node
  );
  const stats = React.useMemo(() => {
    return {
      calories: entries.reduce((curr, next) => curr + (next.calories || 0), 0),
      fat: entries.reduce((curr, next) => curr + (next.fat || 0), 0),
      carbs: entries.reduce((curr, next) => curr + (next.carbs || 0), 0),
      protein: entries.reduce((curr, next) => curr + (next.protein || 0), 0),
    };
  }, [data]);

  return (
    <div>
      <DayNavigator onRefresh={() => undefined} rootUrl="/foodlog/" />
      <Spacer />
      {!loading ? null : (
        <span className="text-purple-400 animate-pulsate">
          <PrimaryLoader text="Loading..." timeBeforeRender={0} />
        </span>
      )}
      {!loading && entries.length === 0 ? (
        <div className="flex flex-col max-w-md pointer-events-none">
          <div className="pt-4 border-t border-slate-50 mt-4 opacity-25 max-w-sm font-thin text-2xl">
            Nothing here, yet! Get started by entering a food in the form below.
          </div>
        </div>
      ) : null}
      <div className={cx("flex flex-col w-full gap-1")}>
        {entries.map((entry) => (
          <LogEntry key={entry.id} {...entry} day={dayString} />
        ))}
      </div>
      <Spacer />
      <div
        className={cx(
          "flex flex-wrap justify-around w-full border-t border-slate-200 transition-opacity",
          {
            "opacity-50": !entries.length,
          }
        )}
      >
        {columns.map((column) => {
          return (
            <div key={column} className="flex flex-col">
              <div className="pt-4 mt-4 flex flex-col">
                <div className="text-5xl font-thin text-slate-400 text-center truncate">
                  {stats[column].toLocaleString()}
                </div>
                <div className="text-xs uppercase text-slate-400 font-bold text-center">
                  {column}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Spacer />
      <div className="flex gap-4 flex-col md:flex-row">
        <div className="w-full md:w-1/2">
          <NewFoodLogPanel
            day={dayString}
            onSearch={setSearchTerm}
            formStateRef={newFoodLogFormObjectRef}
            descriptionInputRef={newFoodLogDescriptionInputRef}
          />
        </div>
        <div className="w-full md:w-1/2">
          <FoodSearchAutocomplete
            searchTerm={searchTerm}
            day={dayString}
            onItemAdded={() => {
              newFoodLogFormObjectRef.current?.clear();
              newFoodLogDescriptionInputRef.current?.focus();
            }}
          />
        </div>
      </div>
    </div>
  );
}
