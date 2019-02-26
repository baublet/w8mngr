import { ApolloServer } from "apollo-server-lambda";
import typeDefs from "./config/schema";
import resolvers from "./resolvers";
import contextAuthenticator from "./helpers/contextAuthenticator";

export const server = new ApolloServer({
  typeDefs,
  resolvers: resolvers,
  introspection: true,
  playground: true,
  context: contextAuthenticator
});

export const handler = server.createHandler();
