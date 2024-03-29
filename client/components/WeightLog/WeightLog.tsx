import React from "react";
import { useParams } from "react-router";

import { dayStringFromDate, getWithDefault } from "../../../shared";
import { useGetCurrentUserWeightLogQuery } from "../../generated";
import { DayNavigator } from "../DayNavigator";
import { PrimaryLoader } from "../Loading/Primary";
import { NewWeightLog } from "./NewWeightLog";
import { WeightLogEntry } from "./WeightLogEntry";

export function WeightLog() {
  const { day } = useParams<{ day?: string }>();
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

  const loading = !Boolean(data?.currentUser?.weightLog);
  const entries = getWithDefault(data?.currentUser?.weightLog.edges, []).map(
    (edge) => edge.node
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
            <div className="border-t border-slate-50 opacity-25 max-w-sm font-thin text-2xl">
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
