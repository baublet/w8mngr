import { create } from "./create";
import { findOneOrFail } from "./findOneOrFail";
import { update } from "./update";
import {accountExists} from "./accountExists"

export const userAccountDataService = {
  accountExists,
  create,
  findOneOrFail,
  update,
};

export { UserAccountEntity } from "./types";
