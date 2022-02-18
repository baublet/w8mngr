const path = require("path");

/**
 * Our GraphQL service
 */
const { createServer: createViteServer } = require("vite");

const { server, httpServer, app } = require("./api/graphql.js");

server.start().then(async () => {
  server.applyMiddleware({ app, path: "/.netlify/functions/graphql" });

  console.log("Initializing Vite");
  const vite = await createViteServer({
    server: { middlewareMode: "html" },
    configFile: path.resolve(process.cwd(), "vite.config.js"),
  });
  console.log("Attaching Vite middlewares");
  app.use(vite.middlewares);

  httpServer.listen({ port: 8080, host: "0.0.0.0" });
  console.log("😺 Local server running! http://localhost:8080");
});

/**
 * Recurring tasks and workers
 */
const { CronJob } = require("cron");
const { handler: minuteWorker } = require("./api/worker");

const minuteWorkerJob = new CronJob("* * * * *", minuteWorker);

console.log("Starting recurring tasks");
minuteWorkerJob.start();

const killTasks = () => {
  process.stdout.write("Stopping recurring tasks");
  minuteWorkerJob.stop();
};
process.on("SIGINT", killTasks);
process.on("SIGABRT", killTasks);
process.on("SIGTERM", killTasks);
process.on("exit", killTasks);
