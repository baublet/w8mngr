import { create } from "./create.js";
import { accountExists } from "./accountExists.js";
import { rootService } from "./rootService.js";

export const userAccountDataService = {
  ...rootService,
  accountExists,
  create,
};

export type { UserAccountEntity } from "./types.js";
