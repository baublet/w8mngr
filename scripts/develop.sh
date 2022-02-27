#/bin/bash

docker-compose up -d

source ~/.bashrc

nvm use

pm2 stop all
pm2 delete all
pm2 delete ecosystem.config.js

pm2 start ecosystem.config.js
pm2 logs