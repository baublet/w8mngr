import { ApolloServer } from "@apollo/server";
import {
  startServerAndCreateCloudflareWorkersHandler,
  CloudflareWorkersHandler,
} from "@as-integrations/cloudflare-workers";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";

import { getSchema } from "./config/schema.graphql";
import { authenticateRequest } from "./authentication/authenticateRequest";
import { resolvers } from "./resolvers";

const handleGraphQLRequest: CloudflareWorkersHandler =
  startServerAndCreateCloudflareWorkersHandler(
    new ApolloServer({
      typeDefs: getSchema(),
      resolvers,
      introspection: true,
      logger: console,
      plugins: [ApolloServerPluginLandingPageLocalDefault({ footer: false })],
    }),
    {
      context: async ({ request }) => {
        const authResult = await authenticateRequest({ request });
        return authResult.context;
      },
    }
  );

export default {
  async fetch(request: Request) {
    return handleGraphQLRequest(request);
  },
};
