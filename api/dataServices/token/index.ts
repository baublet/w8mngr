import { create } from "./create";
import { deleteExpiredTokens } from "./deleteExpiredTokens";
import { getOrCreate } from "./getOrCreate";
import { findOneOrFail } from "./findOneOrFail";
import { findByToken } from "./findByToken";
import { update } from "./update";

export const tokenDataService = {
  create,
  deleteExpiredTokens,
  getOrCreate,
  findByToken,
  findOneOrFail,
  update,
};

export { TokenEntity } from "./types";
