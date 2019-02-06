import { ResponseType } from "./config/types";
import {
  registrationSuccess,
  bodyParseError,
  registrationErrorEmailTaken
} from "./config/messages";
import parseBody from "./helpers/parseBody";
import findByEmail from "./user/findByEmail";
import createUser from "./user/create";

export const handler = (event): Promise<ResponseType> => {
  return new Promise(async resolve => {
    try {
      const { email, password } = parseBody(event.body),
        existingUser = await findByEmail(email);

      if (existingUser) {
        return resolve({
          statusCode: 400,
          body: JSON.stringify({
            error: true,
            message: registrationErrorEmailTaken
          })
        });
      }

      createUser(email, password)
        .then(result => {
          resolve({
            statusCode: 200,
            body: JSON.stringify({
              error: false,
              message: registrationSuccess,
              user: result
            })
          });
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
