import cx from "classnames";
import React from "react";

import { useQuickSearchFoodsQuery } from "../../generated";
import { ButtonSpinnerIcon } from "../Loading/ButtonSpinner";
import { SideBarHeading } from "../Type/SideBarHeading";
import { AddableFoods } from "../Foods";
import { useEvents } from "../../helpers/useEvents";
import { PopularFoods } from "../Foods";
import { ClearButton } from "../Button/ClearButton";
import { CloseIcon } from "../Icons/Close";

export function FoodSearchAutocomplete({
  searchTerm = "",
  day,
  clear,
}: {
  searchTerm?: string;
  day: string;
  clear: () => void;
}) {
  const { data: searchData, loading: searchLoading } = useQuickSearchFoodsQuery(
    {
      variables: { input: { searchTerm } },
    }
  );
  const { fire } = useEvents();
  const foods = searchData?.searchFoods;

  return (
    <div
      className={cx("flex-grow text-sm", {
        "pointer-events-none opacity-50": searchLoading,
      })}
    >
      {searchTerm.length < 3 ? (
          <PopularFoods day={day} />
      ) : (
        <div>
          <SideBarHeading>
            <div className="flex gap-4 w-full items-center">
              <div>Search term: {searchTerm?.toUpperCase()}</div>
              <div className={cx("flex-grow", { "opacity-0": !searchLoading })}>
                <ButtonSpinnerIcon />
              </div>
              <div>
                <ClearButton onClick={clear}>
                  <CloseIcon />
                </ClearButton>
              </div>
            </div>
          </SideBarHeading>
          <div className="mt-2">
            {!foods?.length ? null : (
              <AddableFoods day={day} foods={foods} uniqueKey="autocomplete" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
