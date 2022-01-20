if [ -z ${DB_CERTIFICATE_DOWNLOAD_URL+x} ]; then
  echo "DB_CERTIFICATE_DOWNLOAD_URL exists in env!"
else
  export $(cat .env | xargs)
fi

echo "Downloading PG cert: [$DB_CERTIFICATE_DOWNLOAD_URL]"

curl --create-dirs -o $HOME/.postgresql/root.crt -O "$DB_CERTIFICATE_DOWNLOAD_URL"
