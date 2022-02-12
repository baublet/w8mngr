import { ApolloProvider } from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import { Application } from "./Application";
import { boot } from "./boot";
import { EventProvider } from "./helpers";
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
      <EventProvider>
        <ApolloProvider client={getClient()}>
          <Application />
        </ApolloProvider>
      </EventProvider>
    </BrowserRouter>,
    mountNode
  );
});
