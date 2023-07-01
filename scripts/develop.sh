source ~/.bashrc &>/dev/null
source ~/.bash_profile &>/dev/null

if ! command -v nvm &>/dev/null; then
  echo "NVM not installed. Please install it."
  exit 1
fi
nvm use $(cat .node-version) &>/dev/null

echo -e "- Stopping any running containers and development processes"

(
  yarn pm2 stop all &
  docker-compose down
) &>/dev/null
(
  yarn pm2 delete all &
  yarn pm2 flush &
  yarn pm2 delete ecosystem.config.js
) &>/dev/null

echo -e "\n- Installing the proper node version and tooling"

# Yarn
if ! command -v yarn &>/dev/null; then
  npm install -g yarn
fi

echo -e "\n- Installing node dependencies"
yarn

echo -e "\n- Starting third-party dependent services"
docker-compose up -d

echo -e "\n- Starting development processes"
yarn pm2 start ecosystem.config.js

echo -e "\n- Launching log viewer"
yarn pm2 logs

exit 0
