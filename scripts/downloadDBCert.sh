if [ ! -f ../.env ]
then
  export $(cat .env | xargs)
else
  echo "No .env file found!"
  exit 1
fi

curl --create-dirs -o $HOME/.postgresql/root.crt -O "$DB_CERTIFICATE_DOWNLOAD_URL"
