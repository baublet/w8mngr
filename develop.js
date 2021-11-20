const { server, httpServer, app } = require("./api/graphql.js");

server.start().then(async () => {
  server.applyMiddleware({ app, path: "/graphql" });

  app.get("/",)

  httpServer.listen({ port: 8080 });
});
