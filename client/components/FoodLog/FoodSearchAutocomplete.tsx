import cx from "classnames";
import React from "react";

import {
  GetCurrentUserFoodLogDocument,
  useCreateOrUpdateFoodLogMutation,
  useQuickSearchFoodsQuery,
  useSearchFoodsQuery,
} from "../../generated";
import { useKeyPressHandler } from "../../helpers";
import { SystemOutlineIconButton } from "../Button/SystemOutlineIcon";
import { Add } from "../Icons/Add";
import { ButtonSpinnerIcon } from "../Loading/ButtonSpinner";
import { SideBarHeading } from "../Type/SideBarHeading";
import { MeasurementList } from "./FoodSearchAutocompleteMeasurementsList";
import { FoodLogInput } from "./types";

export function FoodSearchAutocomplete({
  searchTerm = "",
  day,
  onItemAdded,
}: {
  searchTerm?: string;
  day: string;
  onItemAdded?: () => void;
}) {
  const { data: searchData, loading: searchLoading } = useQuickSearchFoodsQuery(
    {
      variables: { input: { searchTerm } },
    }
  );
  const [selectedFoodId, setSelectedFoodId] = React.useState<string>();
  const [saveFoodLog, { loading }] = useCreateOrUpdateFoodLogMutation({
    refetchQueries: [
      {
        query: GetCurrentUserFoodLogDocument,
        variables: { day },
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      onItemAdded?.();
    },
  });
  const selectedFood = React.useMemo(() => {
    if (!selectedFoodId) {
      return undefined;
    }
    return searchData?.searchFoods.find((food) => food.id === selectedFoodId);
  }, [searchData, selectedFoodId]);

  const goToNextFood = React.useCallback(
    (event: KeyboardEvent) =>
      setSelectedFoodId((selectedId) => {
        const foods = searchData?.searchFoods;
        if (!foods || foods.length === 0) {
          return undefined;
        }

        event.preventDefault();
        const foundFoodIndex = foods.findIndex(
          (food) => food.id === selectedId
        );
        if (foundFoodIndex === -1) {
          return foods[0].id;
        }

        const newIndex = foundFoodIndex + 1;
        if (newIndex >= foods.length) {
          return foods[0].id;
        }

        return foods[newIndex].id;
      }),
    [searchData]
  );

  const goToPreviousFood = React.useCallback(
    (event: KeyboardEvent) =>
      setSelectedFoodId((selectedId) => {
        const foods = searchData?.searchFoods;
        if (!foods || foods.length === 0) {
          return undefined;
        }

        event.preventDefault();
        const foundFoodIndex = foods.findIndex(
          (food) => food.id === selectedId
        );
        if (foundFoodIndex === -1) {
          return foods[foods.length - 1].id;
        }

        const newIndex = foundFoodIndex - 1;
        if (newIndex < 0) {
          return foods[foods.length - 1].id;
        }

        return foods[newIndex].id;
      }),
    [searchData]
  );

  const saveSelectedFood: (input: FoodLogInput) => void = React.useCallback(
    (input) => {
      setSelectedFoodId((selectedFoodId) => {
        if (!selectedFoodId) {
          return selectedFoodId;
        }
        saveFoodLog({
          variables: {
            input: {
              day,
              foodLogs: [{ ...input, foodId: selectedFoodId }],
            },
          },
        });
        return selectedFoodId;
      });
    },
    [day]
  );

  const saveSelectedFoodWithoutMeasurements = React.useCallback(
    (event?: KeyboardEvent) => {
      if (!selectedFood || selectedFood.measurements.edges.length > 0) {
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
            foodLogs: [{ description: selectedFood.name }],
          },
        },
      });
    },
    [selectedFood]
  );

  const deselectFood = React.useCallback(
    () => setSelectedFoodId(undefined),
    []
  );

  useKeyPressHandler("up", goToPreviousFood);
  useKeyPressHandler("down", goToNextFood);
  useKeyPressHandler("enter", saveSelectedFoodWithoutMeasurements);
  useKeyPressHandler("esc", deselectFood);

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
                <ButtonSpinnerIcon />
              </div>
            </div>
          </SideBarHeading>
          <div className="mt-2">
            {searchData?.searchFoods.map((food) => {
              const selected = food.id === selectedFoodId;
              return (
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
                      onClick={() => setSelectedFoodId(food.id)}
                    >
                      {food.name}
                    </button>
                    {food.measurements.edges.length > 0 ? null : (
                      <div>
                        <SystemOutlineIconButton
                          size="extra-small"
                          className={cx("transition-all transform scale-75", {
                            "pointer-events-none opacity-0 -translate-x-5":
                              !selected,
                            "translate-x-0 opacity-100": selected,
                          })}
                          title={`Add ${food.name}`}
                          onClick={saveSelectedFoodWithoutMeasurements}
                        >
                          <Add />
                        </SystemOutlineIconButton>
                      </div>
                    )}
                  </div>
                  {!selected ? null : (
                    <MeasurementList
                      food={food}
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
