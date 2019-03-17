import jwt from "jsonwebtoken";
import findUserByEmailAndToken from "api/user/findByEmailAndToken";
import secrets from "api/config/secrets";
import { log } from "api/config/log";

export default function contextAuthenticator({ event: request }) {
  if (!request || !request.headers || !request.headers.authorization) {
    log(
      "GQL request has no auth headers " +
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
      });
    } catch (e) {
      resolve({ messages: `Authentication failed: ${e}` });
    }
  });
}
