import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from "@apollo/client";

import { boot } from "./boot";
import { Application } from "./Application";

boot().then(() => {
  const MOUNT_NODE = document.getElementById("root");
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: "/.netlify/functions/graphql",
      fetch: async (req, res) => {
        // Each query takes at least 200ms to finish.
        await new Promise<void>((resolve) => {
          setTimeout(() => resolve(), 200);
        });
        return fetch(req, res);
      },
    }),
  });

  ReactDOM.render(
    <BrowserRouter>
      <ApolloProvider client={client}>
        <Application />
      </ApolloProvider>
    </BrowserRouter>,
    MOUNT_NODE
  );
});
