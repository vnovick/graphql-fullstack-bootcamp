# Directives

`@include`
include field if argument is true
`@skip`
skip field if argument is true


```
query getPosts($includeUser: Boolean!) {
  posts(order_by:{ timestamp: desc}) {
    id
    subject
    content
    user @include(if: $includeUser){
      firstName
      lastName
    }
    timestamp
  }
}

```

# Fragments

```

fragment userWithAvatar on users {
  firstName
  lastName
  profile {
    avatarUrl
  }
}


fragment userFragment on posts {
  user {
        ...userWithAvatar
    		comments {
          message
        }
      }
  }
  
fragment postsData on posts {
  id
  subject
  content
}

query getPosts($includeUser: Boolean!) {
  posts(order_by:{ timestamp: desc}) {
    ...postsData
    ...userFragment @include(if: $includeUser)
    timestamp
  }
}

subscription subPosts {
  posts {
    ...postsData
    ...userFragment
  }
}
```

# Inline Fragments

```
query HeroForEpisode($ep: Episode!) {
  hero(episode: $ep) {
    name
    ... on Droid {
      primaryFunction
    }
    ... on Human {
      height
    }
  }
}
```


# Type System

## GraphQLObjectType
a type with some fields
## Build in scalar types: 

Int: A signed 32‐bit integer.
Float: A signed double-precision floating-point value.
String: A UTF‐8 character sequence.
Boolean: true or false.
ID: The ID scalar type represents a unique identifier, often used to refetch an object or as the key for a cache. The ID type is serialized in the same way as a String; however, defining it as an ID signifies that it is not intended to be human‐readable.

> You can define your own scalar types 

```
scalar Date
```

## Enums

```
enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}
```

## Lists
`[String]`

## Non-Null 
adding `!` in Schema definition tells us that type is not null


# Introspection

```
query {
  __schema {
    types {
      name
    }
  }
}
```

# Defining your schema

```
type Query {
  posts: [Post!]!
}
type Mutation {
  createDraft(title: String!, content: String, author: String!): Post
}
```

Documenting

```
"Description for the type"
type Post {
  """
    Description for field
  """
```

# Tooling
[GraphiQL](https://github.com/graphql/graphiql)

[GraphCMS](https://graphcms.com/)

[GraphQL Playground](https://github.com/prisma/graphql-playground)

[Hasura](hasura.io)

[GraphQL Docs](https://graphql-docs.com)

# Setting up basic server

[graphql-yoga](https://github.com/prisma/graphql-yoga)
[apollo-server](https://www.apollographql.com/docs/apollo-server/)
[graphql-express](https://github.com/graphql/express-graphql)


## For subscriptions check
[graphql-subscriptions](https://github.com/apollographql/graphql-subscriptions)

# Authentication

