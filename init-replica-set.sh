#!/bin/bash

mongo=mongo
port=27017

echo "Waiting for MongoDB to be ready..."
# Wait for MongoDB to be up and running (check the connection status)
until mongosh --host ${mongo}:${port} --eval 'quit(db.runCommand({ ping: 1 }).ok ? 0 : 1)' &>/dev/null; do
  echo "MongoDB is not ready yet, retrying..."
  sleep 2
done
echo "###### Working ${mongo} instance found, initiating user setup & initializing rs setup.."

# Setup user + pass and initialize replica sets
mongosh --host ${mongo}:${port} <<EOF
use admin;
var rootUser  = '$MONGO_INITDB_ROOT_USERNAME';
var rootPassword = '$MONGO_INITDB_ROOT_PASSWORD';
var admin = db.getSiblingDB('admin');
admin.auth(rootUser , rootPassword);

var config = {
    "_id": "rs0",
    "members": [
        {
            "_id": 1,
            "host": "${mongo}:${port}"
        }
    ]
};
rs.initiate(config);
rs.status();
EOF