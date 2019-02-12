## Core principles and Syntax

Executing Post request

```
curl \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{ "query": "{ posts { subject } }" }' \
  http://localhost:8080/v1alpha1/graphql
```



## Queries

GraphQL is asking for a specific fields on objects
```
{
  allFilms {
    films {
      title
    }
  }
}
```

### Arguments

```
{
  allFilms(first:1) {
    films {
      title
    }
  }
}
```

### Aliases

```
query getPosts {
  first_post: posts(order_by: [{ timestamp:asc}], limit: 1) {
    subject
  }
  last_post: posts(order_by: [{ timestamp:asc}], limit: 1) {
    subject
  }
}

```

### Operation name

```
query getPosts
```

### variables

```

mutation deletePost($postId: uuid!) {
  delete_posts(where:{id: {_eq: $postId}}) {
    affected_rows
    returning {
      id
    }
  }
}

```

default variables 

use `=` for setting default values


## Mutations

```
mutation {
  insert_posts(objects: [{
    subject: "First blog post"
    content: "Hello there"
    user: {
      data: {
        firstName:"John"
        lastName:"Smith"
        profile: {
          data:{ avatarUrl:"some url" bio:"Lorem ipsum"}
        }
      }
    }
  }]) {
    returning {
      id
      subject
      content
      user {
        firstName
        lastName
      }
      
    }
  }
}
```

## Subscriptions

```
subscription subscribeToMostLikedPosts {
  posts(order_by:{ likes:asc} limit: 3) {
    subject
    content
  }
}
```



