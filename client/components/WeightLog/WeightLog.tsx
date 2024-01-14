import React from "react";
import { useRoute } from "wouter";

import { getWithDefault } from "../../../shared/getWithDefault";
import { dayStringFromDate } from "../../../shared/dayStringFromDate";
import { useGetCurrentUserWeightLogQuery } from "../../generated";
import { DayNavigator } from "../DayNavigator";
import { PrimaryLoader } from "../Loading/Primary";
import { NewWeightLog } from "./NewWeightLog";
import { WeightLogEntry } from "./WeightLogEntry";

export function WeightLog() {
  const [, params] = useRoute("/weightlog/:day");
  const day = params?.day || "no-day-in-url";
  const dayString = React.useMemo(() => {
    if (!day) {
      return dayStringFromDate(new Date());
    }
    return day;
  }, [day]);

  const { data } = useGetCurrentUserWeightLogQuery({
    fetchPolicy: "network-only",
    variables: {
      day: dayString,
    },
  });

  const loading = !data?.currentUser?.weightLog;
  const entries = getWithDefault(data?.currentUser?.weightLog.edges, []).map(
    (edge) => edge.node,
  );

  return (
    <div className="flex flex-col gap-4">
      <DayNavigator rootUrl="/weightlog/" />
      {!loading ? null : (
        <span className="text-purple-400 animate-pulsate">
          <PrimaryLoader text="Loading..." timeBeforeRender={0} />
        </span>
      )}
      <div className="flex flex-col gap-4 md:flex-row">
        {!loading && entries.length === 0 ? (
          <div className="flex flex-col max-w-md pointer-events-none w-full md:w-1/2">
            <div className="pt-4 border-t border-slate-50 mt-4 text-slate-400 max-w-sm font-thin text-2xl">
              Nothing here, yet! Get started by entering a weight in the form
              below.
            </div>
          </div>
        ) : null}

        {entries.length === 0 ? null : (
          <div className={"flex flex-col gap-2 w-full md:w-1/2"}>
            {entries.map((entry) => (
              <WeightLogEntry key={entry.id} day={dayString} entry={entry} />
            ))}
          </div>
        )}

        {loading ? null : (
          <div className="w-full md:w-1/2">
            <NewWeightLog day={dayString} />
          </div>
        )}
      </div>
    </div>
  );
}
