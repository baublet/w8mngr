import cx from "classnames";
import React from "react";

import { useQuickSearchFoodsQuery } from "../../generated";
import { ButtonSpinnerIcon } from "../Loading/ButtonSpinner";
import { SideBarHeading } from "../Type/SideBarHeading";
import { AddableFoods } from "../Foods";
import { useEvents } from "../../helpers";

export function FoodSearchAutocomplete({
  searchTerm = "",
  day,
}: {
  searchTerm?: string;
  day: string;
}) {
  const { data: searchData, loading: searchLoading } = useQuickSearchFoodsQuery(
    {
      variables: { input: { searchTerm } },
    }
  );
  const { fire } = useEvents();

  const foods = searchData?.searchFoods;

  React.useEffect(() => {
    fire("addableFoodInert", "autocomplete");
  }, [searchTerm]);

  return (
    <div
      className={cx("flex-grow text-sm", {
        "pointer-events-none opacity-50": searchLoading,
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
            {!foods?.length ? null : (
              <AddableFoods day={day} foods={foods} uniqueKey="autocomplete" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
