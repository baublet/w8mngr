#/bin/bash
set -e

yarn gql:generate

bash -c '$DOWNLOAD_DB_SSL_COMMAND'

yarn db:migrate

yarn build:css
yarn build:api
yarn build:client

cp client/*.svg client-build/
cp client/*.png client-build/
cp client/*.ico client-build/
cp client/*.xml client-build/
cp client/*.svg client-build/
cp client/*.webmanifest client-build/

mkdir -p functions/config
cp api/graphql.js functions/graphql.js
cp api/graphql.j.maps functions/graphql.js.map
cp api/config/schema.graphql functions/config/schema.graphql
cp api/worker.js functions/worker.js
cp api/worker.js.map functions/worker.js.map
