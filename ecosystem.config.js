module.exports = {
  apps: [
    {
      name: "web",
      script: "develop.js",
      watch: ["api/graphql.js", "develop.js", "api/worker.js"],
      node_args: ["-r", "dotenv/config", "--enable-source-maps"],
      autorestart: false,
      restart_delay: 250,
    },
    {
      name: "build-backend",
      script: "npm",
      args: "run build:api",
      watch: ["api", "shared"],
      ignore_watch: [
        "api/graphql.js",
        "api/graphql.js.map",
        "api/worker.js",
        "api/worker.js.map",
      ],
      autorestart: false,
      restart_delay: 250,
    },
    {
      name: "build-gql",
      script: "npm",
      args: "run gql:generate",
      watch: [
        "api/config/schema.graphql",
        "client/queries/*.graphql",
        "client/queries/**/*.graphql",
      ],
      autorestart: false,
      restart_delay: 250,
    },
    {
      name: "build-css",
      script: "npm",
      args: "run build:css",
      watch: ["client/**/*.{html,ts,tsx}"],
      autorestart: false,
      restart_delay: 250,
    },
  ],
};
