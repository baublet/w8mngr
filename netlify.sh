#/bin/bash
set -e

yarn gql:generate

bash -c '$DOWNLOAD_DB_SSL_COMMAND'

yarn db:migrate

yarn build:css
yarn build:api
yarn build:client

mkdir -p functions/config

cp client/*.svg client-build/
cp client/*.png client-build/
cp client/*.ico client-build/
cp client/*.xml client-build/
cp client/*.svg client-build/
cp client/*.webmanifest client-build/

cp api/graphql.js functions/graphql.js
cp api/config/schema.graphql functions/config/schema.graphql
