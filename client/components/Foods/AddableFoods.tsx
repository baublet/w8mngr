import React from "react";

import { useEvents, useKeyPressHandler } from "../../helpers";
import { AddableFood, AddableFoodProp } from "./AddableFood";

export function AddableFoods({
  foods,
  day,
  uniqueKey,
}: {
  foods: AddableFoodProp[];
  day: string;
  /**
   * We don't want the Autocomplete key bindings to affect our popular food key
   * bindings. To do this, when any food in here is selected, we fire an event
   * to tell other AddableFoods components to be inert until the user interacts
   * with them again.
   */
  uniqueKey: string;
}) {
  const { subscribe, unsubscribe, fire } = useEvents();
  const [inert, setInert] = React.useState(false);
  const [selectedFoodId, setSelectedFoodId] = React.useState<
    string | undefined
  >(undefined);

  const selectFoodId = React.useCallback(
    (id: string) => (selected: boolean) => {
      fire("addableFoodInert", uniqueKey);
      if (selected) {
        return setSelectedFoodId(id);
      }
      setSelectedFoodId(undefined);
    },
    [foods, day]
  );

  const deselectFood = React.useCallback(
    () => setSelectedFoodId(undefined),
    [inert]
  );

  const selectNextFood = React.useCallback(() => {
    setSelectedFoodId((id) => {
      if (inert) return;

      const index = foods.findIndex((f) => f.id === id);
      if (index === -1) {
        return foods?.[0]?.id;
      }
      const newId = foods?.[index + 1]?.id;
      if (newId) {
        return newId;
      }
      return foods?.[0]?.id;
    });
  }, [inert]);

  const selectPreviousFood = React.useCallback(() => {
    setSelectedFoodId((id) => {
      if (inert) return;
      const index = foods.findIndex((f) => f.id === id);
      if (index < 1) {
        return foods?.[foods.length - 1]?.id;
      }
      return foods?.[index - 1]?.id;
    });
  }, [inert]);

  useKeyPressHandler("esc", deselectFood);
  useKeyPressHandler("down", selectNextFood);
  useKeyPressHandler("up", selectPreviousFood);

  React.useEffect(() => {
    subscribe("foodLogAdded", "AddableFoodsDeselect", deselectFood);
    subscribe("addableFoodInert", uniqueKey, (broadcasterUniqueKey) => {
      if (uniqueKey === broadcasterUniqueKey) {
        setInert(false);
        return;
      }
      deselectFood();
      setInert(true);
    });
    return () => {
      unsubscribe("foodLogAdded", "AddableFoodsDeselect");
      unsubscribe("addableFoodInert", uniqueKey);
    };
  }, []);

  return (
    <>
      {foods.map((food) => (
        <AddableFood
          key={food.id}
          day={day}
          food={food}
          selected={food.id === selectedFoodId}
          setSelected={selectFoodId(food.id)}
        />
      ))}
    </>
  );
}
