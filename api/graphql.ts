import fs from "fs";
import http from "http";
import path from "path";

import { makeExecutableSchema } from "@graphql-tools/schema";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
  GraphQLRequestContext,
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import createHandler from "serverless-http";

import { config, log } from "./config";
import { Context, createGraphqlContext } from "./createContext";
import { resolvers } from "./resolvers";

require('dotenv').config()



const typeDefs = fs
  .readFileSync(path.resolve(__dirname, "config", "schema.graphql"))
  .toString();

export const app = express();
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);

export const httpServer = http.createServer(app);

export const server = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs,
    resolvers,
  }),
  introspection: true,
  context: createGraphqlContext,
  logger: console,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground({
      settings: {
        "request.credentials": "include",
      },
    }),
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      requestDidStart: async () => {
        return {
          willSendResponse: async (requestContext) => {
            const { context } =
              requestContext as GraphQLRequestContext<Context>;

            const response = context.getResponse();
            if (response) {
              for (const [cookieName, { value, options }] of Array.from(
                context.getCookies().entries()
              )) {
                if (value !== undefined) {
                  response.cookie(cookieName, value, {
                    ...options,
                    httpOnly: true,
                  });
                } else {
                  response.clearCookie(cookieName);
                }
              }
            }
          },
        };
      },
    },
  ],
});

export const handler = createHandler(app);

if (config.get("NETLIFY")== "true") {
  log(
    "info",
    "Netlify build detected. Booting server and applying GQL middleware"
  );
  server.start().then(() => {
    server.applyMiddleware({ app, path: "/.netlify/functions/graphql" });
  });
}
