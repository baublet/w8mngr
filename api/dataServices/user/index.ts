import { createDataService } from "../createDataService";
import { authenticate } from "./authenticate";
import { create } from "./create";
import { login } from "./login";
import { loginWithToken } from "./loginWithToken";
import { logout } from "./logout";
import { getQuery } from "./query";
import { register } from "./register";
import { resetPassword } from "./resetPassword";

export const userDataService = {
  ...createDataService(getQuery, "User"),
  authenticate,
  create,
  login,
  loginWithToken,
  logout,
  register,
  resetPassword,
};

export { UserEntity } from "./types";
