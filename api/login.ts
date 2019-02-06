import { ResponseType } from "./config/types";
import {
  bodyParseError,
  loginSuccessMessage,
  loginErrorMessage
} from "./config/messages";
import { sign } from "jsonwebtoken";
import issueToken from "./user/issueToken";
import findByEmailAndPassword from "./user/findByEmailAndPassword";
import parseBody from "./helpers/parseBody";
import secrets from "./config/secrets";

export const handler = (event): Promise<ResponseType> => {
  return new Promise(resolve => {
    try {
      const { email, password } = parseBody(event.body);

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
              statusCode: 200,
              body: JSON.stringify({
                error: false,
                message: loginSuccessMessage,
                token
              })
            });
          } else {
            resolve({
              statusCode: 200,
              body: JSON.stringify({
                error: true,
                message: loginErrorMessage
              })
            });
          }
        })
        .catch(e => {
          resolve({
            statusCode: 500,
            body: JSON.stringify(e)
          });
        });
    } catch (e) {
      resolve({
        statusCode: 400,
        body: JSON.stringify({
          error: true,
          message: bodyParseError
        })
      });
    }
  });
};
