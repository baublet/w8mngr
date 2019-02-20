import { MutationFn } from "react-apollo";
import foodLogQuery from "queries/foodLog";
import { FoodEntryType } from "api/foodEntries/types";

export default function deleteFoodEntry(
  id: number,
  day: number,
  deleteFoodEntry: MutationFn
): void {
  deleteFoodEntry({
    variables: { id: id },
    update: (proxy, { data: { deleteFoodEntry } }) => {
      // Read the data from our cache for this query.
      const data: any = proxy.readQuery({
        query: foodLogQuery,
        variables: { day: day }
      });
      proxy.writeQuery({
        query: foodLogQuery,
        variables: { day: day },
        data: {
          foodEntries: data.foodEntries.filter(
            (entry: FoodEntryType) => entry.id !== id
          )
        }
      });
    }
  });
}
