import { ApolloServer } from "@apollo/server";
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

declare global {
  interface Request {
    services: ServiceContainer;
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
            runTelemetry: false
          },
          includeCookies: true,
        }),
      ],
    }),
    {
      context: async ({ request }) => {
        const authResult = await authenticateRequest({ request });
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
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    request.services = createServiceContainer();
    request.services.set(envService, env);

    const response = await handleGraphQLRequest(request);

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Credentials", "true");

    return response;
  },
};
