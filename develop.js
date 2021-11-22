const express = require("express");
const path = require("path")

const { server, httpServer, app } = require("./api/graphql.js");

server.start().then(async () => {
  server.applyMiddleware({ app, path: "/graphql" });
  app.use("/", express.static("client"));

  app.use(function (req, res) {
    res.sendFile(path.resolve(process.cwd(), "client", "index.html"));
  });

  // Handle 500
  app.use(function (error, req, res, next) {
    res.send("500: Internal Server Error", 500);
    console.log(error)
  });

  httpServer.listen({ port: 8080 });
});
