import { ApolloServer } from "@apollo/server";
import { parse, serialize } from "cookie";
import {
  createServiceContainer,
  ServiceContainer,
} from "@baublet/service-container";
import {
  startServerAndCreateCloudflareWorkersHandler,
  CloudflareWorkersHandler,
} from "@as-integrations/cloudflare-workers";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";

import { getSchema } from "./config/schema.graphql";
import { authenticateRequest } from "./authentication/authenticateRequest";
import { resolvers } from "./resolvers";
import { Env, envService } from "./config/db";
import { Context } from "./createContext";
import { PromiseResolutionValue } from "../shared/types";

declare global {
  interface Request {
    services: ServiceContainer;
    authResult?: PromiseResolutionValue<ReturnType<typeof authenticateRequest>>;
  }
}

const handleGraphQLRequest: CloudflareWorkersHandler =
  startServerAndCreateCloudflareWorkersHandler(
    new ApolloServer({
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
    }
  );

export default {
  async fetch(request: Request, env: Env) {
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
