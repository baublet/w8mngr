const express = require("express");

const { server, httpServer, app } = require("./api/graphql.js");

server.start().then(async () => {
  server.applyMiddleware({ app, path: "/graphql" });
  app.use("/", express.static("client"));

  httpServer.listen({ port: 8080 });
});
