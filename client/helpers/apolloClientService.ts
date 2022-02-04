import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const GRAPHQL_ENDPOINT =
  process.env.GRAPHQL_ENDPOINT || "/.netlify/functions/graphql";

const MINIMUM_REQUEST_MS = 50;

export function apolloClientService() {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: GRAPHQL_ENDPOINT,
      fetch: async (req, res) => {
        const result = fetch(req, res);
        // Each query takes at least MINIMUM_REQUEST_MS to finish.
        await new Promise<void>((resolve) => {
          setTimeout(() => resolve(), MINIMUM_REQUEST_MS);
        });
        return result;
      },
    }),
  });
  return () => client;
}
