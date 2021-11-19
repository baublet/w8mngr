import path from "path";
import fs from "fs";
import http from "http";

import express from "express";
import createHandler from "@vendia/serverless-express";
import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginDrainHttpServer,
} from "apollo-server-core";

import { resolvers } from "./resolvers";
import { createContext } from "./createContext";

const typeDefs = fs
  .readFileSync(path.resolve(process.cwd(), "api", "config", "schema.graphql"))
  .toString();

export const app = express();

export const httpServer = http.createServer(app);

export const server = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs,
    resolvers,
  }),
  introspection: true,
  context: createContext,
  logger: console,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground(),
    ApolloServerPluginDrainHttpServer({ httpServer }),
  ],
});

export const handler = createHandler({ app });
