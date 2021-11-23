#/bin/bash
set -e

yarn gql:generate

if [ "$BRANCH" == "master" ]; then
  bash -c '$DOWNLOAD_DB_SSL_COMMAND'

  # When we're ready to go live, use this
  # yarn migrate:production

  # In development, reset the database every deploy
  yarn db:reset:production
else
  yarn db:reset:develop
fi

yarn build:css
yarn build:api
yarn build:client

mkdir -p functions/config

cp api/graphql.js functions/graphql.js
cp api/config/schema.graphql functions/config/schema.graphql