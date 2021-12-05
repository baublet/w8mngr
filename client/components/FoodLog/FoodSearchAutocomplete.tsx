import React from "react";
import cx from "classnames";

import { SideBarHeading } from "../Type/SideBarHeading";
import { ButtonSpinner } from "../Loading/ButtonSpinner";
import { PrimaryIconButton } from "../Button/PrimaryIcon";
import { LeftIcon } from "../Icons/Left";
import { RightIcon } from "../Icons/Right";
import { Add } from "../Icons/Add";
import { SystemOutlineButton } from "../Button/SystemOutline";
import { Input } from "../Forms";
import { Link } from "../Link";

import {
  getMeasurementWithMultiplier,
  measurementStringToNumberOrUndefined,
} from "../Foods/FoodListItem";

import {
  useSearchFoodsQuery,
  useCreateOrUpdateFoodLogMutation,
  GetCurrentUserFoodLogDocument,
} from "../../generated";
import { useForm } from "../../helpers";

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
  onItemAdded,
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
        "pointer-events-none opacity-50": loading,
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
                    className={cx(
                      "block w-full text-left p-2 text-xs uppercase font-bold text-gray-500 hover:text-gray-600 hover:bg-gray-50",
                      {
                        "bg-gray-100": selected,
                      }
                    )}
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
    id: string;
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

  const amountFormData = useForm<{
    amount: string;
  }>({
    initialValues: {
      amount: selectedMeasurement?.amount,
    },
  });

  return (
    <div className="p-2 bg-gray-50 border border-gray-100">
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
                  <Input
                    value={amountFormData.getValue("amount")}
                    placeholder="amount"
                    type="text"
                    onChange={amountFormData.getHandler("amount")}
                  />
                </div>
                <div className="w-3/12 truncate" title="measurement">
                  {measurement.node.measurement}
                </div>
                <div className="w-2/12 truncate" title="calories">
                  {getMeasurementWithMultiplier({
                    currentAmount: amountFormData.getValue("amount"),
                    measurementValue: measurement.node.calories || 0,
                    originalAmount: measurement.node.amount,
                  })}
                </div>
                <div className="w-1/12 truncate" title="fat">
                  {getMeasurementWithMultiplier({
                    currentAmount: amountFormData.getValue("amount"),
                    measurementValue: measurement.node.fat || 0,
                    originalAmount: measurement.node.amount,
                  })}
                </div>
                <div className="w-1/12 truncate" title="carbohydrates">
                  {getMeasurementWithMultiplier({
                    currentAmount: amountFormData.getValue("amount"),
                    measurementValue: measurement.node.carbs || 0,
                    originalAmount: measurement.node.amount,
                  })}
                </div>
                <div className="w-1/12 truncate" title="protein">
                  {getMeasurementWithMultiplier({
                    currentAmount: amountFormData.getValue("amount"),
                    measurementValue: measurement.node.protein || 0,
                    originalAmount: measurement.node.amount,
                  })}
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
          <div
            className="w-full flex items-center gap-2 text-gray-400 text-xs"
            style={{ fontSize: ".75em" }}
          >
            <div className="w-1/12"></div>
            <div className="w-2/12 truncate" title="amount">
              amount
            </div>
            <div className="w-3/12 truncate" title="measurement">
              measurement
            </div>
            <div className="w-2/12 truncate" title="calories">
              calories
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
          <div className="w-full flex gap-1 mt-4 items-center">
            <div className="w-1/12"></div>
            <div className="w-10/12 flex items-center gap-4 justify-between border-t border-gray-200 pt-3">
              <Link to={`/food/edit/${food.id}`}>View food details</Link>
              {!selectedMeasurement ? null : (
                <SystemOutlineButton
                  size="extra-small"
                  onClick={() => {
                    saveSelectedFood({
                      description: `${amountFormData.getValue("amount")} ${selectedMeasurement.measurement}, ${food.name}`,
                      calories: measurementStringToNumberOrUndefined(
                        getMeasurementWithMultiplier({
                          currentAmount: amountFormData.getValue("amount"),
                          measurementValue: selectedMeasurement.calories || 0,
                          originalAmount: selectedMeasurement.amount,
                        })
                      ),
                      fat: measurementStringToNumberOrUndefined(
                        getMeasurementWithMultiplier({
                          currentAmount: amountFormData.getValue("amount"),
                          measurementValue: selectedMeasurement.fat || 0,
                          originalAmount: selectedMeasurement.amount,
                        })
                      ),
                      carbs: measurementStringToNumberOrUndefined(
                        getMeasurementWithMultiplier({
                          currentAmount: amountFormData.getValue("amount"),
                          measurementValue: selectedMeasurement.carbs || 0,
                          originalAmount: selectedMeasurement.amount,
                        })
                      ),
                      protein: measurementStringToNumberOrUndefined(
                        getMeasurementWithMultiplier({
                          currentAmount: amountFormData.getValue("amount"),
                          measurementValue: selectedMeasurement.protein || 0,
                          originalAmount: selectedMeasurement.amount,
                        })
                      ),
                    });
                  }}
                  leftIcon={<Add />}
                >
                  Add
                </SystemOutlineButton>
              )}
            </div>
            <div className="w-1/12"></div>
          </div>
        </div>
      )}
    </div>
  );
}
