#!/bin/bash

DIR="scripts/createActivityLibrarySql/free-exercise-db"

if [ -d "$DIR" ]; then
    echo -e "💫  Refreshing the repo...\n"
    cd $DIR
    git reset --hard origin/main
    cd ..
else
    echo -e "🤖  Cloning the exercise DB repo...\n"
    git clone git@github.com:yuhonas/free-exercise-db.git scripts/createActivityLibrarySql/free-exercise-db
fi

bun ./seed.ts
