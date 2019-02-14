const { GraphQLServer, PubSub } = require('graphql-yoga')

let idCount = 0
let posts = []
const channel = Math.random().toString(36).substring(2, 15)

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
  Subscription: {
    posts: {
      subscribe: (parent, args, { pubsub }) => {
        setImmediate(() => pubsub.publish(channel, { posts}))
        return pubsub.asyncIterator(channel)
      },
    }
  },
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
