#/bin/bash
node -v

if [ "$BRANCH" == "master" ]; then
  bash -c '$DOWNLOAD_DB_SSL_COMMAND'
  yarn migrate:production
else
  yarn db:reset:develop
fi

yarn gql:generate
yarn build:css
yarn build:api
yarn build:client

mkdir -p functions/config

cp api/graphql.js functions/graphql.js
cp api/config/schema.graphql functions/config/schema.graphql