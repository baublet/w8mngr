import { ApolloServer } from "apollo-server-lambda";
import typeDefs from "api/config/schema";
import resolvers from "api/resolvers";
import contextAuthenticator from "api/helpers/contextAuthenticator";

export const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: contextAuthenticator
});

export const handler = server.createHandler();
