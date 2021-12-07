import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || "/.netlify/functions/graphql";

export function apolloClientService() {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: GRAPHQL_ENDPOINT,
      fetch: async (req, res) => {
        const result = fetch(req, res);
        // Each query takes at least 250ms to finish.
        await new Promise<void>((resolve) => {
          setTimeout(() => resolve(), 250);
        });
        return result;
      },
    }),
  });
  return () => client;
}
