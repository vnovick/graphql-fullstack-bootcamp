const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const MyGraphQLSchema = buildSchema(`

type Query {
  posts: [Post!]!
  post(id: ID!): Post
  description: String!
}

type Mutation {
  createDraft(title: String!, content: String, author: String!): Post
  addComment(id: ID!, content: String!): ID
  deletePost(id: ID!): Post
  publish(id: ID!): Post
}

type Post {
  id: ID!
  title: String!
  content: String!
  published: Boolean!
  author: Author!
  comments: [Comment]
}


type Author {
  id: ID!
  name: String!
}

type Comment {
  id: ID!
  content: String!
}
`)

app.use('/graphql', graphqlHTTP({
  schema: MyGraphQLSchema,
  graphiql: true
}));

app.listen(4000);