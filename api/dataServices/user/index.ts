import { authenticate } from "./authenticate";
import { create } from "./create";
import { login } from "./login";
import { logout } from "./logout";
import { register } from "./register";
import { resetPassword } from "./resetPassword";

import { createDataService } from "../createDataService";
import { getQuery } from "./query";

export const userDataService = {
  ...createDataService(getQuery, "User"),
  authenticate,
  create,
  login,
  logout,
  register,
  resetPassword,
};

export { UserEntity } from "./types";
