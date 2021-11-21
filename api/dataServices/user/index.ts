import { authenticate } from "./authenticate";
import { create } from "./create";
import { findOneOrFail } from "./findOneOrFail";
import { login } from "./login";
import { logout } from "./logout";
import { register } from "./register";

export const userDataService = {
  authenticate,
  create,
  findOneOrFail,
  login,
  logout,
  register,
};

export { UserEntity } from "./types";
