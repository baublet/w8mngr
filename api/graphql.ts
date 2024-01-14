import { ApolloServer } from "@apollo/server";
import { serialize } from "cookie";
import {
  createServiceContainer,
  ServiceContainer,
} from "@baublet/service-container";
import { startServerAndCreateCloudflareWorkersHandler } from "@as-integrations/cloudflare-workers";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";

import { getSchema } from "./config/schema.graphql.js";
import { authenticateRequest } from "./authentication/authenticateRequest.js";
import { resolvers } from "./resolvers/index.js";
import { DBEnv, dbEnvService } from "./config/db.js";
import { Env, envService } from "./config/env.js";
import { PromiseResolutionValue } from "../shared/types.js";
import { Context } from "./createContext.js";

declare global {
  interface Request {
    services: ServiceContainer;
    authResult?: PromiseResolutionValue<ReturnType<typeof authenticateRequest>>;
  }
}

const handleGraphQLRequest = startServerAndCreateCloudflareWorkersHandler(
  new ApolloServer<Context>({
    typeDefs: getSchema(),
    resolvers,
    introspection: true,
    logger: console,
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({
        footer: false,
        embed: {
          runTelemetry: false,
        },
        includeCookies: true,
      }),
    ],
  }),
  {
    context: async ({ request }) => {
      const authResult = await authenticateRequest({ request });
      request.authResult = authResult;
      return authResult.context;
    },
  },
);

export default {
  async fetch(request: Request, env: DBEnv & Env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Content-Type,Authorization,Remember-Token",
        },
      });
    }

    request.services = createServiceContainer();
    request.services.set(envService, env);
    request.services.set(dbEnvService, env);

    const response = await handleGraphQLRequest(request);

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Credentials", "true");

    const cookies = request.authResult?.context.getCookies();
    if (cookies) {
      for (const [name, cookie] of cookies.entries()) {
        const cookieString = serialize(name, cookie.value || "", {
          path: "/",
          secure: true,
          httpOnly: true,
          sameSite: "strict",
          ...cookie.options,
        });
        response.headers.append("Set-Cookie", cookieString);
      }
    }

    return response;
  },
};
