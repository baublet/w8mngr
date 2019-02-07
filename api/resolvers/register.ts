import {
  registrationSuccess,
  bodyParseError,
  registrationErrorEmailTaken
} from "../config/messages";
import findByEmail from "../user/findByEmail";
import createUser from "../user/create";
import { RequestError, AuthType } from "./types";
import login from "./login";

export default (_, { email, password }): Promise<AuthType | RequestError> => {
  return new Promise(async resolve => {
    try {
      const existingUser = await findByEmail(email);

      if (existingUser) {
        return resolve({
          status: 400,
          message: registrationErrorEmailTaken
        });
      }

      createUser(email, password)
        .then(async result => {
          resolve(await login({}, { email, password }));
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
