# Exercises Day1

[Install Hasura on Heroku](https://docs.hasura.io/1.0/graphql/manual/getting-started/heroku-simple.html)

Go to Heroku dashboard 
Settings -> Reveal config vars.
Copy DATABASE_URL

Install Hasura Console on local environment

### Prerequisites
For running GraphQL Api locally [Install Docker](https://docs.docker.com/install/)

Edit `./run-hasura-locally.sh` and substitute HASURA_GRAPHQL_DATABASE_URL to the one you've got from heroku

then run `./run-hasura-locally.sh`


This will bring up docker container with Hasura engine with connection to existing Postgres API
You can read more about Hasura [here](https://medium.com/open-graphql/effortless-real-time-graphql-api-with-serverless-business-logic-running-in-any-cloud-8585e4ed6fa3)

Access Hasura console on localhost:8080/console

If you want to play around with your local version of postgres check this docs [link](https://docs.hasura.io/1.0/graphql/manual/getting-started/docker-simple.html)

- starwars api

[GraphiQL](https://graphql-bootcamp-swapi.herokuapp.com)

> Bonus you can add swapi custom server as remote schema in hasura console

[Remote schemas docs](https://docs.hasura.io/1.0/graphql/manual/remote-schemas/index.html#step-2-merge-remote-schema)


# Core principles


# Syntax and query language

1. What's wrong with this syntax?
```
query {
  posts: {
    timestamp,
    users: {
      firstName
    }
  }
}
```
2. How to execute graphql request as curl


# Queries 

3. Get first 5 planets in Star Wars universe along with their name, diameter, rotation period, residents. For each resident display it's name, species, classification and spoken language. Also for each resident display vehicles that he used as well as in which movies they appeared


4. Get `subject` and `content` of `posts` ordered by `timestamp` ascending. Represent data as `ordered_posts` array
  

# Mutations

5. Add new blog post
6. Add a new user using GraphQL Mutation
7. Create reusable insert mutation called addPost, which not only will insert a post, but create new user and profile 
   
   > Hint: use variables


# Subscriptions
Return `n` most liked post where `n` can be provided from outside.
