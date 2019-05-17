# w8mngr [![Build Status](https://travis-ci.org/baublet/w8mngr-2020.svg?branch=master)](https://travis-ci.org/baublet/w8mngr-2020)

w8mngr utilizing Netlify's functions and a React SPA

As of February 6, 2019, I blew out the history so I can make this repo public. I had some old AWS connection info in here when it was private.

We only require Postgres initialized properly to get started. You will need a local PostgreSQL DB up and running on the default port (5432). We expect a user named `postgres` with the password `password`.

# Testing

If you have configured Postgres properly, you should be able to run the following commands:

```bash
# Run this first
npm run test:init   # Setup your DB structure

npm install         # Install the dependencies
npm run test:all    # Test all the things!

# Or, to just test specific things
npm run test:shared # Shared code. Add `-- --watch` to watch
npm run test:api
# npm run test:client  # Coming soon. We don't yet have a need for client tests

npm run test -- /path/to/file # Test a single file
```

# Development

See the steps above for initializing the database user. Once that's done and you have installed your dependencies via `npm install`, you should be good to go with:

```bash
# Run this first
npm run develop:init    # Sets up the initial DB structure

npm run start:client    # Starts the React client
npm run start:lambda    # Starts the GraphQL/Auth server
```
