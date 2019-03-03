import {
  registrationSuccess,
  bodyParseError,
  registrationErrorEmailTaken
} from "../config/messages";
import findByEmail from "../user/findByEmail";
import createUser from "../user/create";
import { RequestError, AuthType } from "./types";
import { login } from "./login";

export async function register(
  _,
  { email, password }
): Promise<AuthType | RequestError> {
  const existingUser = await findByEmail(email);

  if (existingUser) {
    return {
      status: 400,
      message: registrationErrorEmailTaken
    };
  }

  const register = await createUser(email, password);
  return await login({}, { email, password });
}
