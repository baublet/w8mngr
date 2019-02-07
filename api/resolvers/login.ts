import { bodyParseError, loginErrorMessage } from "../config/messages";
import { sign } from "jsonwebtoken";
import issueToken from "../user/issueToken";
import findByEmailAndPassword from "../user/findByEmailAndPassword";
import secrets from "../config/secrets";
import { RequestError, AuthType } from "./types";

export default (_, { email, password }): Promise<AuthType | RequestError> => {
  return new Promise(resolve => {
    try {
      findByEmailAndPassword(email, password)
        .then(async result => {
          if (result) {
            const remember_digest =
                result.remember_digest || (await issueToken(result.id)),
              token = sign(
                {
                  email: result.email,
                  token: remember_digest
                },
                secrets.jwtSecret
              );
            resolve({
              token,
              user: result
            });
          } else {
            resolve({
              status: 200,
              message: loginErrorMessage
            });
          }
        })
        .catch(e => {
          resolve({
            status: 500,
            message: JSON.stringify(e)
          });
        });
    } catch (e) {
      resolve({
        status: 400,
        message: bodyParseError
      });
    }
  });
};
