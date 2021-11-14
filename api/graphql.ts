import path from "path";
import fs from "fs";

import { ApolloServer } from "apollo-server-lambda";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ServiceContainer } from "@baublet/service-container";

import { resolvers } from "./resolvers";
import { createContext } from "./helpers/createContext";
import { UserEntity } from "./dataServices/user";

const typeDefs = fs
  .readFileSync(path.resolve(process.cwd(), "api", "config", "schema.graphql"))
  .toString();

export const server = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs,
    resolvers,
  }),
  introspection: true,
  context: createContext,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

export const handler = server.createHandler();
