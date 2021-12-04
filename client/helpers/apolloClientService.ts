import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export function apolloClientService() {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: "/.netlify/functions/graphql",
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
