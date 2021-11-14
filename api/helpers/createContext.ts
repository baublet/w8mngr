import { createServiceContainer } from "@baublet/service-container";
import { verify } from "jsonwebtoken";
import { LambdaContextFunctionParams } from "apollo-server-lambda/src/ApolloServer";

import { jwtSecret } from "../config/secrets";
import { log } from "../config/log";
import { Context, getContext } from "../context";

export async function createContext({
  event,
}: {
  event: LambdaContextFunctionParams["event"];
}): Promise<Context> {
  if (!event || !event.headers || !event.headers.authorization) {
    log("error", "GQL event has no auth headers ", event.headers.authorization);
    return getContext();
  }
  const token = event.headers.authorization;
  return new Promise<Context>((resolve, reject) => {
    try {
      verify(token, jwtSecret);
      resolve(getContext());
    } catch (error) {
      log("error", "Invalid JWT token", { token, error });
      reject(error);
    }
  });
}
