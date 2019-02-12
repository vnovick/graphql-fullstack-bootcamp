#! /bin/bash

docker run -d -p 8080:8080 \
  -e HASURA_GRAPHQL_DATABASE_URL=postgres://pisfgfotrkeyev:afc3b63598baf280d09e449c0eb47e975ffde1582c0796b7a8b11459a3b8dbb9@ec2-107-20-167-11.compute-1.amazonaws.com:5432/d90nq4c245lrg4 \
  -e HASURA_GRAPHQL_ENABLE_CONSOLE=true \
  hasura/graphql-engine:latest | pbcopy