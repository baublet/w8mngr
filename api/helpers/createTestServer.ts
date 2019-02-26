import { ApolloServer } from "apollo-server-lambda";
import typeDefs from "../config/schema";
import resolvers from "../resolvers";
import { UserType } from "api/user/types";

export function createTestServer(user: UserType) {
  return new ApolloServer({
    typeDefs,
    resolvers: resolvers,
    dataSources: () => ({}),
    context: () => {
      return { user };
    }
  });
}
