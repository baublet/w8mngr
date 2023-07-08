import React from "react";
import cx from "classnames";

import {
  FoodLogInput,
  GetCurrentUserFoodLogDocument,
  useCreateOrUpdateFoodLogMutation,
} from "../../generated";
import { useEvents } from "../../helpers/useEvents";
import { SystemOutlineIconButton } from "../Button/SystemOutlineIcon";
import { Add } from "../Icons/Add";
import { AddableFoodMeasurements } from "./AddableFoodMeasurements";

export type AddableFoodProp = {
  id: string;
  name: string;
  measurements?: {
    edges: {
      node: {
        id: string;
        calories?: number;
        fat?: number;
        carbs?: number;
        protein?: number;
        amount: number;
        measurement: string;
      };
    }[];
  };
};

export function AddableFood({
  day,
  selected,
  setSelected,
  food,
}: {
  day: string;
  selected: boolean;
  setSelected: (selected: boolean) => void;
  food: AddableFoodProp;
}) {
  const measurements = food.measurements;
  const { fire } = useEvents();
  const [saveFoodLog, { loading }] = useCreateOrUpdateFoodLogMutation({
    refetchQueries: [
      {
        query: GetCurrentUserFoodLogDocument,
        variables: { day },
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      fire("foodLogAdded");
    },
  });

  const saveFood: (input: FoodLogInput) => void = React.useCallback(
    (input) => {
      if (!food.id) {
        return;
      }
      saveFoodLog({
        variables: {
          input: {
            day,
            foodLogs: [{ ...input, foodId: food.id }],
          },
        },
      });
    },
    [day, food.name, food.id]
  );

  const saveFoodWithoutMeasurements = React.useCallback(
    (event?: KeyboardEvent) => {
      if (!measurements || measurements.edges.length === 0) {
        return;
      }
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      saveFoodLog({
        variables: {
          input: {
            day,
            foodLogs: [{ description: food.name }],
          },
        },
      });
    },
    [food.name]
  );

  return (
    <div
      className={cx("flex-grow text-sm", {
        "pointer-events-none opacity-50": loading,
      })}
    >
      <div
        key={food.id}
        className={cx(
          "flex w-full flex-col text-xs hover:text-slate-600 hover:bg-slate-50 rounded-lg",
          {
            "bg-slate-100": selected,
          }
        )}
      >
        <div className="flex w-full">
          <button
            type="button"
            className={cx(
              "block w-full text-left p-2 uppercase font-bold text-slate-500"
            )}
            onClick={() => setSelected(true)}
          >
            {food.name}
          </button>
          {measurements && measurements.edges.length > 0 ? null : (
            <div>
              <SystemOutlineIconButton
                size="extra-small"
                className={cx("transition-all transform scale-75", {
                  "pointer-events-none opacity-0 -translate-x-5": !selected,
                  "translate-x-0 opacity-100": selected,
                })}
                title={`Add ${food.name}`}
                onClick={saveFoodWithoutMeasurements}
              >
                <Add />
              </SystemOutlineIconButton>
            </div>
          )}
        </div>
        {!selected ? null : (
          <AddableFoodMeasurements food={food} saveSelectedFood={saveFood} />
        )}
      </div>
    </div>
  );
}
