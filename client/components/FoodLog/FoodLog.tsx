import cx from "classnames";
import React from "react";

import { or } from "../../../shared/coalesce";
import { getWithDefault } from "../../../shared/getWithDefault";
import { useGetCurrentUserFoodLogQuery } from "../../generated";
import { useDebouncedValue } from "../../helpers/useDebouncedValue";
import { DayNavigator } from "../DayNavigator";
import { PrimaryLoader } from "../Loading/Primary";
import { FoodSearchAutocomplete } from "./FoodSearchAutocomplete";
import { LogEntry } from "./LogEntry";
import { NewFoodLogPanel } from "./NewFoodLogPanel";
import type { NewFoodLogFormObject } from "./NewFoodLogPanel";

const columns: ["calories", "fat", "carbs", "protein"] = [
  "calories",
  "fat",
  "carbs",
  "protein",
];

export function FoodLog({ day }: { day: string }) {
  const { data } = useGetCurrentUserFoodLogQuery({
    fetchPolicy: "network-only",
    variables: {
      day,
    },
  });
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm);
  const newFoodLogFormObjectRef = React.useRef<
    NewFoodLogFormObject | undefined
  >(undefined);
  const newFoodLogDescriptionInputRef = React.useRef<HTMLInputElement | null>(
    null
  );
  const clear = React.useCallback(
    () => newFoodLogFormObjectRef.current?.clear(),
    []
  );

  const loading = !Boolean(data?.currentUser?.foodLog);

  const entries = getWithDefault(data?.currentUser?.foodLog.edges, []).map(
    (edge) => edge.node
  );
  const stats = React.useMemo(() => {
    return {
      calories: entries.reduce((curr, next) => curr + or(next.calories, 0), 0),
      fat: entries.reduce((curr, next) => curr + or(next.fat, 0), 0),
      carbs: entries.reduce((curr, next) => curr + or(next.carbs, 0), 0),
      protein: entries.reduce((curr, next) => curr + or(next.protein, 0), 0),
    };
  }, [data]);

  const totalsMarkup = React.useMemo(() => {
    return (
      <div
        className={cx(
          "flex flex-wrap gap-4 md:flex-nowrap justify-around w-full transition-opacity",
          {
            "opacity-50": !entries.length,
          }
        )}
      >
        {columns.map((column) => {
          return (
            <div
              key={column}
              className={cx(`flex flex-col`, {
                "w-full md:w-auto": column === "calories",
              })}
            >
              <div className="flex flex-col">
                <div
                  className={cx(
                    "text-4xl font-thin text-slate-400 text-center truncate",
                    {
                      "text-7xl md:text-4xl": column === "calories",
                    }
                  )}
                >
                  {stats[column].toLocaleString()}
                </div>
                <div className="text-xs uppercase text-slate-400 text-center">
                  {column}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [data]);

  return (
    <div className="flex flex-col gap-4">
      <DayNavigator onRefresh={() => undefined} rootUrl="/foodlog/" />
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
      <div className={cx("flex flex-col w-full gap-4")}>
        {entries.map((entry) => (
          <LogEntry key={entry.id} {...entry} day={day} />
        ))}
      </div>
      <div className="block md:hidden">{totalsMarkup}</div>
      <div className="flex gap-4 flex-col md:flex-row">
        <div className="w-full md:w-1/2">
          <NewFoodLogPanel
            day={day}
            onSearch={setSearchTerm}
            formStateRef={newFoodLogFormObjectRef}
            descriptionInputRef={newFoodLogDescriptionInputRef}
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="hidden md:block">{totalsMarkup}</div>
          <div>
            <FoodSearchAutocomplete
              searchTerm={debouncedSearchTerm}
              day={day}
              clear={clear}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
