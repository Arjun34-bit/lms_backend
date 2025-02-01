#!/bin/bash

# Source the .env file if it exists
if [ -f .env ]; then
  . ./.env
fi

docker exec -i mongo mongosh <<EOF
use admin

var admin = db.getSiblingDB('admin');
admin.auth("$MONGO_INITDB_ROOT_USERNAME", "$MONGO_INITDB_ROOT_PASSWORD");

rs.initiate({
    "_id": "rs0",
    "members": [
        {
            "_id": 1,
            "host": "mongo:27017"
        }
    ]
});
rs.status();
EOF
