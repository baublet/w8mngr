w8mngr utilizing Netlify's functions and a React SPA

[![Build Status](https://travis-ci.org/baublet/w8mngr-2020.svg?branch=master)](https://travis-ci.org/baublet/w8mngr-2020)

As of February 6, 2019, I blew out the history so I can make this repo public. I had some old AWS connection info in here when it was private.

# Testing

You will need a local PostgreSQL DB up and running on the default port (5432) with the structure added in `test/initial_structure.sql`.

TODO: Make this automatic.

After that, you _should_ be able to just

```bash
npm install
npm run test:all
```

This will run you through all of the unit and integration tests.

# Development

See the steps above for initializing the DB structure. Once that's done and you have installed your dependencies via `npm install`, you should be good to go with

```bash
npm run watch:client    # Starts the React client
npm run start:lambda    # Starts the GraphQL/Auth server
```
