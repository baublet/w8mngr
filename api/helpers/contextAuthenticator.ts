import jwt from "jsonwebtoken";
import findUserByEmailAndToken from "../user/findByEmailAndToken";
import secrets from "../config/secrets";
import { log } from "../config/log";

export default ({ event: request }) => {
  log("GQL Request: " + JSON.stringify(request));
  if (!request || !request.headers || !request.headers.authorization) {
    log(
      "GQL request has no auth headers" +
        JSON.stringify(request.headers.authorization)
    );
    return {};
  }
  return new Promise(resolve => {
    try {
      const token = request.headers.authorization;
      jwt.verify(token, secrets.jwtSecret, async (err, decoded) => {
        if (err) {
          return resolve({});
        }
        const user = await findUserByEmailAndToken(
          decoded.email,
          decoded.token
        );
        resolve(user ? { user } : {});
        if (user) log("User authenticated. ID: " + user.id.toString());
        else log("Failed to auth: " + JSON.stringify(decoded));
      });
    } catch (e) {
      resolve({ messages: `Authentication failed: ${e}` });
    }
  });
};
