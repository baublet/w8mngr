import React from "react";
import cx from "classnames";

import { SideBarHeading } from "../Type/SideBarHeading";
import { ButtonSpinner } from "../Loading/ButtonSpinner";
import { PrimaryIconButton } from "../Button/PrimaryIcon";
import { LeftIcon } from "../Icons/Left";
import { RightIcon } from "../Icons/Right";
import { PrimaryButton } from "../Button/Primary";
import { Add } from "../Icons/Add";
import type { NewFoodLogFormObject } from "./NewFoodLogPanel";

import {
  useSearchFoodsQuery,
  useCreateOrUpdateFoodLogMutation,
  GetCurrentUserFoodLogDocument,
} from "../../generated";

type FoodLogInput = {
  description: string;
  calories?: number;
  fat?: number;
  carbs?: number;
  protein?: number;
};

export function FoodSearchAutocomplete({
  searchTerm = "",
  day,
  onItemAdded
}: {
  searchTerm?: string;
  day: string;
  onItemAdded?: () => void;
}) {
  const { data: searchData, loading: searchLoading } = useSearchFoodsQuery({
    variables: { searchTerm },
  });
  const [selectedFoodId, setSelectedFoodId] = React.useState<string>();
  const [saveFoodLog, { loading }] = useCreateOrUpdateFoodLogMutation({
    onCompleted: () => {
      onItemAdded?.();
    },
  });

  const saveSelectedFood: (input: FoodLogInput) => void = React.useCallback(
    (input) => {
      console.log({ input });
      setSelectedFoodId((selectedFoodId) => {
        if (!selectedFoodId) {
          return selectedFoodId;
        }
        saveFoodLog({
          refetchQueries: [
            {
              query: GetCurrentUserFoodLogDocument,
              variables: {
                day,
              },
            },
          ],
          variables: {
            input: {
              day,
              foodLogs: [input],
            },
          },
        });
        return selectedFoodId;
      });
    },
    []
  );

  return (
    <div
      className={cx("flex-grow text-sm", {
        "pointer-events-none opacity-75": loading,
      })}
    >
      {searchTerm.length < 3 ? null : (
        <div>
          <SideBarHeading>
            <div className="flex gap-4">
              <div>Search term: {searchTerm?.toUpperCase()}</div>
              <div className={cx("ml-2", { "opacity-0": !searchLoading })}>
                <ButtonSpinner />
              </div>
            </div>
          </SideBarHeading>
          <div className="mt-2">
            {searchData?.currentUser?.foods.edges.map((food) => {
              const selected = food.node.id === selectedFoodId;
              return (
                <div key={food.cursor}>
                  <button
                    type="button"
                    className={cx("block w-full text-left p-2", {
                      "bg-gray-50": selected,
                    })}
                    onClick={() => setSelectedFoodId(food.node.id)}
                  >
                    {food.node.name}
                  </button>
                  {!selected ? null : (
                    <MeasurementList
                      food={food.node}
                      saveSelectedFood={saveSelectedFood}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function MeasurementList({
  food,
  saveSelectedFood,
}: {
  saveSelectedFood: (input: FoodLogInput) => void;
  food: {
    name: string;
    measurements: {
      edges: {
        node: {
          id: string;
          amount: number;
          measurement: string;
          calories?: number;
          fat?: number;
          carbs?: number;
          protein?: number;
        };
      }[];
    };
  };
}) {
  const [selectedMeasurementId, setSelectedMeasurementId] = React.useState(
    food.measurements.edges[0]?.node.id
  );

  const selectedMeasurement = React.useMemo(() => {
    if (!selectedMeasurementId) {
      return undefined;
    }
    return food.measurements.edges.find(
      (measurement) => measurement.node.id === selectedMeasurementId
    )?.node;
  }, [selectedMeasurementId]);

  const hasPrevious = React.useMemo(() => {
    if (!selectedMeasurementId) {
      return false;
    }
    const selectedIndex = food.measurements.edges.findIndex(
      (measurement) => measurement.node.id === selectedMeasurementId
    );
    if (selectedIndex < 1) {
      return false;
    }
    return true;
  }, [selectedMeasurementId]);

  const goToPrevious = React.useCallback(() => {
    if (!selectedMeasurementId) {
      return;
    }
    const selectedIndex = food.measurements.edges.findIndex(
      (measurement) => measurement.node.id === selectedMeasurementId
    );
    if (selectedIndex < 1) {
      return;
    }
    const newIndex = selectedIndex - 1;
    const newMeasurement = food.measurements.edges[newIndex];
    if (!newMeasurement) {
      return;
    }
    setSelectedMeasurementId(newMeasurement.node.id);
  }, [selectedMeasurementId]);

  const hasNext = React.useMemo(() => {
    if (!selectedMeasurementId) {
      return false;
    }
    const selectedIndex = food.measurements.edges.findIndex(
      (measurement) => measurement.node.id === selectedMeasurementId
    );
    if (selectedIndex === -1) {
      return false;
    }
    if (selectedIndex >= food.measurements.edges.length - 1) {
      return false;
    }
    return true;
  }, [selectedMeasurementId]);

  const goToNext = React.useCallback(() => {
    if (!selectedMeasurementId) {
      return;
    }
    const selectedIndex = food.measurements.edges.findIndex(
      (measurement) => measurement.node.id === selectedMeasurementId
    );
    if (selectedIndex === -1) {
      return;
    }
    const newIndex = selectedIndex + 1;
    const newMeasurement = food.measurements.edges[newIndex];
    if (!newMeasurement) {
      return;
    }
    setSelectedMeasurementId(newMeasurement.node.id);
  }, [selectedMeasurementId]);

  return (
    <div className="p-2">
      {food.measurements.edges.length === 0 ? null : (
        <div className="mt-2 relative">
          {food.measurements.edges.map((measurement) => {
            return (
              <div
                key={measurement.node.id}
                className={cx("w-full flex items-center gap-2", {
                  "opacity-0 absolute pointer-events-none":
                    measurement.node.id !== selectedMeasurementId,
                })}
              >
                <div className="w-1/12">
                  <PrimaryIconButton
                    title="Previous measurement"
                    disabled={!hasPrevious}
                    onClick={goToPrevious}
                    size="extra-small"
                  >
                    <LeftIcon />
                  </PrimaryIconButton>
                </div>
                <div className="w-2/12" title="amount">
                  {measurement.node.amount}
                </div>
                <div className="w-3/12 truncate" title="measurement">
                  {measurement.node.measurement}
                </div>
                <div className="w-2/12 truncate" title="calories">
                  {measurement.node.calories}
                </div>
                <div className="w-1/12 truncate" title="fat">
                  {measurement.node.fat}
                </div>
                <div className="w-1/12 truncate" title="carbohydrates">
                  {measurement.node.carbs}
                </div>
                <div className="w-1/12 truncate" title="protein">
                  {measurement.node.protein}
                </div>
                <div className="w-1/12">
                  <PrimaryIconButton
                    title="Next measurement"
                    disabled={!hasNext}
                    onClick={goToNext}
                    size="extra-small"
                  >
                    <RightIcon />
                  </PrimaryIconButton>
                </div>
              </div>
            );
          })}
          <div className="w-full flex items-center gap-2 text-gray-400 text-xs">
            <div className="w-1/12"></div>
            <div className="w-2/12 truncate" title="amount">
              amount
            </div>
            <div className="w-3/12 truncate" title="measurement">
              measurement
            </div>
            <div className="w-2/12 truncate" title="calories">
              cals
            </div>
            <div className="w-1/12 truncate" title="fat">
              fat
            </div>
            <div className="w-1/12 truncate" title="carbohydrates">
              carbs
            </div>
            <div className="w-1/12 truncate" title="protein">
              protein
            </div>
            <div className="w-1/12"></div>
          </div>
          {!selectedMeasurement ? null : (
            <div className="w-full flex justify-right">
              <PrimaryButton
                onClick={() => {
                  if (!selectedMeasurement) {
                    return undefined;
                  }
                  saveSelectedFood({
                    description: `${selectedMeasurement.amount} ${selectedMeasurement.measurement}, ${food.name}`,
                    calories: selectedMeasurement.calories,
                    fat: selectedMeasurement.fat,
                    carbs: selectedMeasurement.carbs,
                    protein: selectedMeasurement.protein,
                  });
                }}
                leftIcon={<Add />}
              >
                Add
              </PrimaryButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
