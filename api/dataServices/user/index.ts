import { authenticate } from "./authenticate.js";
import { create } from "./create.js";
import { getAdminUsers } from "./getAdminUsers.js";
import { login } from "./login.js";
import { loginWithToken } from "./loginWithToken.js";
import { logout } from "./logout.js";
import { register } from "./register.js";
import { resetPassword } from "./resetPassword.js";
import { rootService } from "./rootService.js";

export const userDataService = {
  ...rootService,
  authenticate,
  create,
  getAdminUsers,
  login,
  loginWithToken,
  logout,
  register,
  resetPassword,
};

export type { UserEntity } from "./types.js";
