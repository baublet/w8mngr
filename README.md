# w8mngr

- [![TypeScript](https://github.com/baublet/w8mngr-2020/actions/workflows/typecheck.yml/badge.svg)](https://github.com/baublet/w8mngr-2020/actions/workflows/typecheck.yml)
- [![Unit Tests](https://github.com/baublet/w8mngr-2020/actions/workflows/test.yml/badge.svg)](https://github.com/baublet/w8mngr-2020/actions/workflows/test.yml)

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

# Testing

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
