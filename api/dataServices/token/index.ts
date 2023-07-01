import { create } from "./create";
import { deleteByTokenDigests } from "./deleteByTokenDigests";
import { deleteExpiredTokens } from "./deleteExpiredTokens";
import { findByToken } from "./findByToken";
import { getOrCreate } from "./getOrCreate";
import { rootService } from "./rootService";

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
