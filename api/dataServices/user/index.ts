import { authenticate } from "./authenticate";
import { create } from "./create";
import { login } from "./login";
import { loginWithToken } from "./loginWithToken";
import { logout } from "./logout";
import { register } from "./register";
import { resetPassword } from "./resetPassword";
import { rootService } from "./rootService";

export const userDataService = {
  ...rootService,
  authenticate,
  create,
  login,
  loginWithToken,
  logout,
  register,
  resetPassword,
};

export { UserEntity } from "./types";
