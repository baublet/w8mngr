# w8mngr [![Build Status](https://travis-ci.org/baublet/w8mngr-2020.svg?branch=master)](https://travis-ci.org/baublet/w8mngr-2020)

w8mngr utilizing Netlify's functions and a React SPA

As of February 6, 2019, I blew out the history so I can make this repo public. I had some old AWS connection info in here when it was private.

# Testing

You will need a local PostgreSQL DB up and running on the default port (5432). You need a user named `postgres` with the password `password`. Once that's setup, you can run `npm run test:init` to setup your database for testing.

After that, you _should_ be able to just:

```bash
npm install
npm run test:all
```

This will run you through all of the unit and integration tests.

# Development

See the steps above for initializing the database user. Once that's done and you have installed your dependencies via `npm install`, you should be good to go with:

```bash
npm run develop:init    # Sets up the initial DB structure
npm run start:client    # Starts the React client
npm run start:lambda    # Starts the GraphQL/Auth server
```
