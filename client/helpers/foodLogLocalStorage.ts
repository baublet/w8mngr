export function foodLogLocalStorage() {
  const getItems = () => {
    const storedItems = window.localStorage.getItem("foodLogEntries");
    if (storedItems) {
      try {
        const parsedItems: {
          description: string;
          calories?: number;
          fat?: number;
          carbs?: number;
          protein?: number;
        }[] = JSON.parse(storedItems);

        if (!Array.isArray(parsedItems)) {
          return [];
        }

        return parsedItems;
      } catch {}
    }
    return [];
  };

  const addItem = (item: {
    description: string;
    calories?: number;
    fat?: number;
    carbs?: number;
    protein?: number;
  }) => {
    const extantItems = getItems();
    extantItems.push(item);
    window.localStorage.setItem("foodLogEntries", JSON.stringify(extantItems));
  };

  const clear = () => window.localStorage.setItem("foodLogEntries", "[]");

  return {
    getItems,
    addItem,
    clear,
  };
}
