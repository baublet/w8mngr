import { create } from "./create";
import { accountExists } from "./accountExists";
import { rootService } from "./rootService";

export const userAccountDataService = {
  ...rootService,
  accountExists,
  create,
};

export type { UserAccountEntity } from "./types";
