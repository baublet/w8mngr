import { verify } from "jsonwebtoken";
import { jwtSecret } from "api/config/secrets";
import { log } from "api/config/log";
import { User } from "graphql-types";

export interface Context {
  currentUser: Promise<User>;
}

export default async function contextAuthenticator({
  event: request
}: {
  event: any;
}) {
  if (!request || !request.headers || !request.headers.authorization) {
    log(
      "GQL request has no auth headers " +
        JSON.stringify(request.headers.authorization)
    );
    return {};
  }
  const token = request.headers.authorization;
  return verify(token, jwtSecret);
}
