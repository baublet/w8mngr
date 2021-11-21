import { authenticate } from "./authenticate";
import { create } from "./create";
import { findOneOrFail } from "./findOneOrFail";
import { login } from "./login";
import { register } from "./register";

export const userDataService = {
  authenticate,
  create,
  findOneOrFail,
  login,
  register,
};

export { UserEntity } from "./types";
