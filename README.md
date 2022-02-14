# w8mngr

[![TypeScript](https://github.com/baublet/w8mngr-2020/actions/workflows/typecheck.yml/badge.svg)](https://github.com/baublet/w8mngr-2020/actions/workflows/typecheck.yml) [![Unit Tests](https://github.com/baublet/w8mngr-2020/actions/workflows/test.yml/badge.svg)](https://github.com/baublet/w8mngr-2020/actions/workflows/test.yml) [![Netlify Status](https://api.netlify.com/api/v1/badges/1430e281-64a2-4f0a-a530-677e2b34cfa8/deploy-status)](https://app.netlify.com/sites/w8mngr/deploys)

w8mngr utilizing Netlify's functions and a React SPA

As of February 6, 2019, I blew out the history so I can make this repo public. I had some old AWS connection info in here when it was private.

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

# Testing

Our test suite needs a live PG database, so make sure `yarn db:reset` works before you try to test. Each test suite (e.g., each file) will create its own database
