import { bodyParseError, loginErrorMessage } from "../config/messages";
import { sign } from "jsonwebtoken";
import issueToken from "../user/issueToken";
import findByEmailAndPassword from "../user/findByEmailAndPassword";
import secrets from "../config/secrets";
import { RequestError, AuthType } from "./types";

export default async (
  _,
  { email, password }
): Promise<AuthType | RequestError> => {
  const user = await findByEmailAndPassword(email, password);
  if (!user) {
    return {
      status: 200,
      message: loginErrorMessage
    };
  }
  const remember_digest = user.remember_digest || (await issueToken(user.id)),
    token = sign(
      {
        email: user.email,
        token: remember_digest
      },
      secrets.jwtSecret
    );
  return {
    token,
    user
  };
};
