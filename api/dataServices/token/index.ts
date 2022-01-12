import {createDataService} from "../createDataService"

import { create } from "./create";
import { deleteByTokenDigests } from "./deleteByTokenDigests";
import { deleteExpiredTokens } from "./deleteExpiredTokens";
import { getOrCreate } from "./getOrCreate";
import { findByToken } from "./findByToken";
import { update } from "./update";

import { getQuery } from "./query";

export const tokenDataService = {
  ...createDataService(getQuery, "Token"),
  // We don't want to be able to upsert tokens
  upsert: undefined,
  create,
  deleteByTokenDigests,
  deleteExpiredTokens,
  getOrCreate,
  findByToken,
  update,
};

export { TokenEntity } from "./types";
