import { config } from "dotenv";
config();

import { ApolloServer } from "@apollo/server";
import type { Request } from "@cloudflare/workers-types";

import { getSchema } from "./config/schema.graphql";
import { authenticateRequest } from "./authentication/authenticateRequest";
import { resolvers } from "./resolvers";

export async function getServer() {
  const typeDefs = await getSchema();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    logger: console,
  });
  return server;
}

export default {
  async fetch(request: Request) {
    const authResult = await authenticateRequest({ request });

    if ("error" in authResult) {
      return new Response(JSON.stringify({ error: authResult.error }), {
        status: 401,
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      });
    }

    const server = await getServer();
    await server.start();
    const httpGraphQLResponse = await server.executeHTTPGraphQLRequest({
      context: async () => authResult.context,
      httpGraphQLRequest: request as any,
    });

    const headersMap: Record<string, string> = {};
    const headersPairs = Array.from(httpGraphQLResponse.headers.entries());
    for (const [key, value] of headersPairs) {
      headersMap[key] = value;
    }
    authResult.context.getCookies
    const statusCode = httpGraphQLResponse.status || 200;

    if (httpGraphQLResponse.body.kind === "complete") {
      const body = httpGraphQLResponse.body.string;
      headersMap["content-length"] = String(body.length);
      headersMap["content-type"] = "application/json;charset=UTF-8";
      return new Response(body, {
        status: statusCode,
        headers: headersMap,
      });
    }

    // Streamed responses

    const { readable, writable } = new TransformStream();

    (async () => {
      // Type guard
      if (httpGraphQLResponse.body.kind === "complete") {
        return;
      }
      const writer = writable.getWriter();
      for await (const chunk of httpGraphQLResponse.body.asyncIterator) {
        writer.write(chunk);
      }
    })();

    return new Response(readable, {
      status: statusCode,
      headers: headersMap,
    });
  },
};
