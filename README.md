# w8mngr

[![TypeScript](https://github.com/baublet/w8mngr-2020/actions/workflows/typecheck.yml/badge.svg)](https://github.com/baublet/w8mngr-2020/actions/workflows/typecheck.yml) [![Unit Tests](https://github.com/baublet/w8mngr-2020/actions/workflows/test.yml/badge.svg)](https://github.com/baublet/w8mngr-2020/actions/workflows/test.yml) [![Netlify Status](https://api.netlify.com/api/v1/badges/1430e281-64a2-4f0a-a530-677e2b34cfa8/deploy-status)](https://app.netlify.com/sites/w8mngr/deploys)

w8mngr utilizing Netlify's functions and a React SPA

# Todo

- [ ] https://github.com/yuhonas/free-exercise-db Add this
- [ ] Faturdays
- [ ] Reminders
- [ ] Routines
- [ ] Personal Trainers

# Setup

To setup your database, you must have `docker-compose` installed. Once it's installed:

```bash
$ docker-compose up
```

This will start Postgres!

This repository was made with `yarn` 3. I highly recommend you use it! To install the packages and build things you need:

```bash
$ yarn
$ yarn gql:generate
```

Now, you're ready to test and develop.

# Dependencies

If you have configured Postgres properly, you should be able to run the following commands:

```bash
$ yarn db:reset
```

# Development

```bash
$ yarn develop
```

Once the server is running, you can login as a seed admin with the following credentials:

```
username: admin@w8mngr.com
password: test
```

Our development environment uses [PM2]() to manage its various build processes and watch threads, as well as to aggregate logging.

```bash
$ yarn pm2 logs all     # See all aggregate logs
$ yarn pm2 logs web     # See only the `web` API logs
$ yarn pm2 stop all     # Stop all services
$ yarn pm2 dash         # Show the PM2 dashboard
```

# Testing

Our test suite needs a live PG database, so make sure `yarn db:reset` works before you try to test. Each test suite (e.g., each file) will create its own schema, run our migrations, and run a test against that discrete database.

```bash
$ yarn test                  # Test all of our suites
$ yarn test <file1> <fileN>  # Test one or more files
```

To signal to the test runner that you require access to the database, make sure you do this at the top of your database tests:

```ts
import { getTestGlobalContext, usesDatabase } from "../../config/test";

usesDatabase();
```

This function will ensure that your database tests are fully isolated from other tests (as well as your development environment data) and are properly cleaned up after the test run.
