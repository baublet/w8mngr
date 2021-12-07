module.exports = {
  apps: [
    {
      name: "graphql",
      script: "develop.js",
      watch: ["api/graphql.js", "develop.js"],
      node_args: ["-r", "dotenv/config", "--enable-source-maps"],
      autorestart: false,
      restart_delay: 250
    },
    {
      name: "build-backend",
      script: "npm",
      args: "run build:api",
      watch: ["api", "shared"],
      ignore_watch: ["api/graphql.js", "api/graphql.js.map"],
      autorestart: false,
      restart_delay: 250
    },
    {
      name: "build-frontend",
      script: "npm",
      args: "run build:client",
      watch: ["client"],
      ignore_watch: [
        "client/index.js",
        "client/index.js.map",
        "client/tailwind.css",
        "client/index.html",
      ],
      autorestart: false,
      restart_delay: 250
    },
    {
      name: "build-css",
      script: "npm",
      args: "run build:css",
      watch: ["tailwind.config.js"],
      autorestart: false,
      restart_delay: 250
    },
    {
      name: "build-gql",
      script: "npm",
      args: "run gql:generate",
      watch: ["api/config/schema.graphql", "client/queries/*.graphql", "client/queries/**/*.graphql"],
      autorestart: false,
      restart_delay: 250
    },
  ],
};
