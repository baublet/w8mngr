import path from "path";
import fs from "fs";
import http from "http";

import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import createHandler from "@vendia/serverless-express";
import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import {
  GraphQLRequestContext,
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginDrainHttpServer,
} from "apollo-server-core";

import { dbService } from "./config/db";
import { resolvers } from "./resolvers";
import { Context, createGraphqlContext } from "./createContext";

const typeDefs = fs
  .readFileSync(path.resolve(process.cwd(), "api", "config", "schema.graphql"))
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
                response.cookie(cookieName, value, {
                  ...options,
                  httpOnly: true,
                });
              }
            }
          },
        };
      },
    },
  ],
});

export const handler = createHandler({ app });
