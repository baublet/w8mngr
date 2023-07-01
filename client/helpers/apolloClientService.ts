import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

import { getConfigValue } from "./getConfigValue";

export function apolloClientService() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: getConfigValue("GRAPHQL_ENDPOINT"),
      fetch: async (req, res) => {
        const result = fetch(req, res);
        // Each query takes at least MINIMUM_REQUEST_MS to finish.
        await new Promise<void>((resolve) => {
          setTimeout(() => resolve(), getConfigValue("MINIMUM_REQUEST_MS"));
        });
        return result;
      },
    }),
  });
}
