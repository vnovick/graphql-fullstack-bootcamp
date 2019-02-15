const { GraphQLServer, PubSub } = require('graphql-yoga')
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');


let idCount = 0
let posts = []
const channel = Math.random().toString(36).substring(2, 15)

function oddValue(value) {
  return value % 2 === 1 ? value : null;
}

const resolvers = {
  Query: {
    posts: () => posts,
    post: (parent, args) => posts.find(post => post.id === args.id),
  },
  Mutation: {
    createDraft: (parent, { object: args }) => {
      const post = {
        id: `post_${idCount++}`,
        title: args.title,
        content: args.content,
        date: args.date,
        comments: [],
        author: {
          id: `author_${new Date().getMilliseconds()}`,
          name: args.author
        },
        published: false,
      }
      posts.push(post)
      pubsub.publish(channel, { posts})
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
          pubsub.publish(channel, { posts})
        }
      })

      return args.id
    },
    deletePost: (parent, args) => {
      const postIndex = posts.findIndex(post => post.id === args.id)
      if (postIndex > -1) {
        const deleted = posts.splice(postIndex, 1)
        pubsub.publish(channel, { posts})
        return deleted[0]
      }
      return null
    },
    publish: (parent, args) => {
      const postIndex = posts.findIndex(post => post.id === args.id)
      posts[postIndex].published = true
      pubsub.publish(channel, { posts})
      return posts[postIndex]
    },
  },
  
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value) // ast value is always in string format
      }
      return null;
    },
  }),
  Subscription: {
    posts: {
      subscribe: (parent, args, { pubsub }) => {
        setImmediate(() => pubsub.publish(channel, { posts}))
        return pubsub.asyncIterator(channel)
      },
    }
  },
  HasContent: {
    __resolveType(obj){
      if (obj.title){
        return 'Post'
      } else {
        return 'Comment'
      }
    }
  }
}

const pubsub = new PubSub()


const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { pubsub }
})

server.start({
  port: 5577,
  endpoint: '/graphql',
  playground: '/playground',
},() => {
  console.log(`The graphql server is running on http://localhost:5577/graphql`)
  console.log(`Playground available here: http://localhost:5577/playground`)
})
