module.exports = {
  setupFilesAfterEnv: ['./testSetup.ts'],
  watchPathIgnorePatterns: ["dev.sqlite3", ".js"],
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
