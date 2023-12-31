import { createDataService } from "../createDataService";

export const rootService = createDataService({
  provider: "W8MNGR_1",
  tableName: "foodLog",
});
