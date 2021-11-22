import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import { boot } from "./boot";
import { Application } from "./Application";

boot();

const MOUNT_NODE = document.getElementById("root");
const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "/.netlify/functions/graphql",
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <Application />
    </ApolloProvider>
  </BrowserRouter>,
  MOUNT_NODE
);
