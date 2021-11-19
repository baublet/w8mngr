module.exports = {
  apps: [
    {
      name: "graphql",
      script: "develop.js",
      watch: ["api/graphql.js", "develop.js"],
      autorestart: false,
    },
    {
      name: "build",
      script: "npm",
      args: "run build:api",
      watch: ["api", "shared"],
      ignore_watch: ["api/graphql.js", "api/graphql.js.map"],
      autorestart: false,
    },
  ],
};
