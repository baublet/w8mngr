import { create } from "./create.js";
import { deleteByTokenDigests } from "./deleteByTokenDigests.js";
import { deleteExpiredTokens } from "./deleteExpiredTokens.js";
import { findByToken } from "./findByToken.js";
import { getOrCreate } from "./getOrCreate.js";
import { rootService } from "./rootService.js";

export const tokenDataService = {
  ...rootService,
  // We don't want to be able to upsert tokens
  upsert: undefined,
  create,
  deleteByTokenDigests,
  deleteExpiredTokens,
  getOrCreate,
  findByToken,
};
