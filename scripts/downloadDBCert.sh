if [ ! -f ../.env ]
then
  export $(cat .env | xargs)
else
  echo "No .env file found!"
  exit 1
fi

if [ -z ${DB_CERTIFICATE_DOWNLOAD_URL+x} ];
  then
    echo "DB_CERTIFICATE_DOWNLOAD_URL exists in env!";
  else
    export $(cat .env | xargs)
  fi

curl --create-dirs -o $HOME/.postgresql/root.crt -O "$DB_CERTIFICATE_DOWNLOAD_URL"
