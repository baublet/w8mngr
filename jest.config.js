module.exports = {
  globalSetup: "./testSetup.ts",
  globalTeardown: "./testTeardown.ts",
  transform: {
    "^.+\\.tsx?$": [
      "esbuild-jest",
      {
        sourcemap: true,
        loaders: {
          ".spec.ts": "tsx",
        },
      },
    ],
  },
};
