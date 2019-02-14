const { ApolloServer, gql } = require('apollo-server');

let idCount = 0
let posts = []

const resolvers = {
  Query: {
    posts: () => posts,
    post: (parent, args) => posts.find(post => post.id === args.id),
  },
  Mutation: {
    createDraft: (parent, args) => {
      const post = {
        id: `post_${idCount++}`,
        title: args.title,
        content: args.content,
        comments: [],
        author: {
          id: `author_${new Date().getMilliseconds()}`,
          name: args.author
        },
        published: false,
      }
      posts.push(post)
      return post
    },
    addComment: (parent, args) => {
      posts.forEach(post => {
        if (post.id === args.id) {
          const comment = {
            id: `comment_${new Date().getMilliseconds()}`,
            content: args.content
          }
          post.comments.push(comment)
        }
      })

      return args.id
    },
    deletePost: (parent, args) => {
      const postIndex = posts.findIndex(post => post.id === args.id)
      if (postIndex > -1) {
        const deleted = posts.splice(postIndex, 1)
        return deleted[0]
      }
      return null
    },
    publish: (parent, args) => {
      const postIndex = posts.findIndex(post => post.id === args.id)
      posts[postIndex].published = true
      return posts[postIndex]
    },
  },
}

const schema = gql`
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
`



const server = new ApolloServer({
  typeDefs: schema,
  resolvers
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});