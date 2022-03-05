#/bin/bash

NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"

if test -f "$NVM_DIR"; then
  load_nvm
else
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
  load_nvm
fi

load_nvm() {
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
}

docker-compose down
docker-compose up -d

nvm use || (nvm install $(cat .nvmrc) && nvm use)

which node

pm2 stop all
pm2 delete all
pm2 delete ecosystem.config.js

pm2 start ecosystem.config.js
pm2 logs