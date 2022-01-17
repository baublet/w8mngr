import { authenticate } from "./authenticate";
import { create } from "./create";
import { login } from "./login";
import { logout } from "./logout";
import { register } from "./register";

import { createDataService } from "../createDataService";
import { getQuery } from "./query";

export const userDataService = {
  ...createDataService(getQuery, "User"),
  authenticate,
  create,
  login,
  logout,
  register,
};

export { UserEntity } from "./types";
