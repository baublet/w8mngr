const express = require("express");
const path = require("path");
const { createServer: createViteServer } = require("vite");

const { server, httpServer, app } = require("./api/graphql.js");

server.start().then(async () => {
  server.applyMiddleware({ app, path: "/.netlify/functions/graphql" });

  console.log("Initiating Vite")
  const vite = await createViteServer({
    server: { middlewareMode: "html" },
    configFile: path.resolve(process.cwd(), "vite.config.js")
  });
  console.log("Attaching Vite middlewares")
  app.use(vite.middlewares);

  httpServer.listen({ port: 8080 });
});
