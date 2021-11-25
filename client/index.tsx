import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import {
  ServiceContainer,
  createServiceContainer,
} from "@baublet/service-container";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from "@apollo/client";

import { boot } from "./boot";
import { Application } from "./Application";
import { apolloClientService } from "./helpers/apolloClientService";

boot().then(async () => {
  const MOUNT_NODE = document.getElementById("root");
  const getClient = await window.w8mngrServiceContainer.get(
    apolloClientService
  );

  ReactDOM.render(
    <BrowserRouter>
      <ApolloProvider client={getClient()}>
        <Application />
      </ApolloProvider>
    </BrowserRouter>,
    MOUNT_NODE
  );
});
