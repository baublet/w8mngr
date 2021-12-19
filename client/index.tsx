import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";

import { boot } from "./boot";
import { Application } from "./Application";
import { apolloClientService } from "./helpers/apolloClientService";

boot().then(async () => {
  const mountNode = document.getElementById("root");
  const getClient = await window.w8mngrServiceContainer.get(
    apolloClientService
  );

  if (!mountNode) {
    throw new Error("No mount node found");
  }

  ReactDOM.render(
    <BrowserRouter>
      <ApolloProvider client={getClient()}>
        <Application />
      </ApolloProvider>
    </BrowserRouter>,
    mountNode
  );
});
