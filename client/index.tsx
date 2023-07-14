import { ApolloProvider } from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom/client";
import { Router } from "wouter";

import { Application } from "./Application";
import { boot } from "./boot";
import { EventProvider } from "./helpers/useEvents";
import { apolloClientService } from "./helpers/apolloClientService";

boot().then(async () => {
  const mountNode = document.getElementById("root");
  const apolloClient = await window.w8mngrServiceContainer.get(
    apolloClientService
  );

  if (!mountNode) {
    throw new Error("No mount node found");
  }

  ReactDOM.createRoot(mountNode).render(
    <div className="relative">
      <div className="toast">
        <React.StrictMode>
          <Router>
            <EventProvider>
              <ApolloProvider client={apolloClient}>
                <Application />
              </ApolloProvider>
            </EventProvider>
          </Router>
        </React.StrictMode>
      </div>
    </div>
  );
});
