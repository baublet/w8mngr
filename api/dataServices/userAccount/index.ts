import { create } from "./create";
import { accountExists } from "./accountExists";

import { getQuery } from "./query";
import { createDataService } from "../createDataService";

export const userAccountDataService = {
  ...createDataService(getQuery, "UserAccount"),
  accountExists,
  create,
};

export { UserAccountEntity } from "./types";
