import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export function apolloClientService() {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: "/.netlify/functions/graphql",
      fetch: async (req, res) => {
        const result = fetch(req, res);
        // Each query takes at least 150ms to finish.
        await new Promise<void>((resolve) => {
          setTimeout(() => resolve(), 150);
        });
        return result;
      },
    }),
  });
  return () => client;
}
