import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

import { getConfigValue } from "./getConfigValue.js";

export function apolloClientService() {
  const tokens: {
    rememberToken: string | undefined;
    authToken: string | undefined;
  } = {
    authToken: undefined,
    rememberToken: undefined,
  };

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: getConfigValue("GRAPHQL_ENDPOINT"),
      fetch: async (url, options) => {
        const result = fetch(url, options);
        // Each query takes at least MINIMUM_REQUEST_MS to finish.
        await new Promise<void>((resolve) => {
          setTimeout(() => resolve(), getConfigValue("MINIMUM_REQUEST_MS"));
        });
        return result;
      },
    }),
  });

  return {
    getClient: () => client,
    setRememberToken: (token: string | undefined) =>
      (tokens.rememberToken = token),
    getRememberAuthToken: () => tokens.rememberToken,
    setAuthToken: (token: string | undefined) => (tokens.authToken = token),
    getAuthToken: () => tokens.authToken,
  };
}
