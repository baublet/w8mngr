const watch = require("node-watch");
const execSync = require("child_process").execSync;
const dependencyTree = require("dependency-tree");
const glob = require("glob");
const { resolve } = require("path");

const watchDir = resolve(__dirname, "..");
let changedFiles = [];
let timeout = null;
let trees = {};

const testsGlob = "./shared/**/*.test.ts";

const testFilter = /\.test\.ts?/;
const fileFilter = /\.tsx?/;
const testTypes = {
  "shared and api": {
    test: /(\/shared\/|\/api\/)/,
    command:
      "TS_NODE_FAST=true TS_NODE_PROJECT='./tsconfig.api.json' NODE_ENV=test ./node_modules/.bin/mocha -r ts-node/register -r tsconfig-paths/register '{{files}}' -P --exit"
  }
};

console.log("w8mngr test watcher initializing");

function getTestType(file) {
  const keys = Object.keys(testTypes);
  file = resolve(file);
  for (let i = 0; i < keys.length; i++) {
    if (testTypes[keys[i]].test.test(file)) {
      return keys[i];
    }
  }
  console.log(`\n- Unknown test type for file: ${file}\n`);
  return false;
}

function runTests(testsByTypes) {
  const keys = Object.keys(testTypes);
  for (let i = 0; i < keys.length; i++) {
    const files = testsByTypes[keys[i]].join(",");
    const command = testTypes[keys[i]].command.replace("{{files}}", files);
    console.log("\n-- RUNNING --");
    console.log(command);
    execSync(command, { stdio: "inherit" });
  }
}

function buildDependencyTree(filename) {
  return dependencyTree({
    filename,
    isListForm: true,
    directory: "./",
    filter: path => path.indexOf("node_modules") === -1
  });
}

function scan(firstRun = false) {
  console.log(
    `\n${firstRun ? "Scanning" : "Rescanning"} ${testsGlob} for test files...`
  );
  glob(testsGlob, {}, function(er, files) {
    trees = {};

    for (let file of files) {
      trees[file.replace("./", "")] = buildDependencyTree(file);
    }
    console.log(`Found ${files.length} test files to watch...`);
  });
}

scan();

console.log(`
-- WATCHING ${watchDir} --
Once the Docker volume caches warm up, your tests will
automatically run when related files are updated...
`);

watch(watchDir, { recursive: true, filter: fileFilter }, function(evt, name) {
  console.log("\n-- FILE CHANGED --\n", name);
  changedFiles.push(name);

  if (timeout) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(() => {
    try {
      // build test list
      const tests = {};
      let totalChanged = 0;
      for (let file of changedFiles) {
        if (file.indexOf(testFilter) >= 0) {
          const testType = getTestType(file);
          if (testType) {
            tests[testType] = tests[testType] || [];
            tests[testType].push(file);
            totalChanged++;
          }
        } else {
          // find it in dependency tree
          for (let f of Object.getOwnPropertyNames(trees)) {
            if (trees[f].some(n => n.indexOf(file) >= 0)) {
              const testType = getTestType(f);
              if (testType) {
                tests[testType] = tests[testType] || [];
                tests[testType].push(f);
                totalChanged++;
              }
            }
          }
        }
      }

      changedFiles = [];

      if (totalChanged) {
        runTests(tests);
      }
    } catch (ex) {
      console.log("\n\nError: ", ex, "\n\n");
    } finally {
      scan();
    }
  }, 500);
});
