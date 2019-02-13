# Consume GraphQL API from Vanilla JS

[Consume GraphQL API](https://codesandbox.io/s/p9828pn87)


# Apollo

[Why apollo and docs](https://www.apollographql.com/docs/react/why-apollo.html)

- Declarative data fetching
- Zero config caching (normalized cache)

[Apollo in Vanilla JS with Parcel](https://codesandbox.io/s/v07082jlwl)

# React

## Getting started

### Apollo Boost

`npm install apollo-boost react-apollo graphql --save`

### Setting client

```
import ApolloClient from "apollo-boost";

import { ApolloProvider } from "react-apollo";


const client = new ApolloClient({
  uri: "my-graphql-endpoint"
});
```
### Run logic on every request

```
request: async (operation) => {
    //called on each requests
    const token = localStorage.getItem("token")
    operation.setContext({
      headers: {
        authorization: token
      }
    })
  },

```
### Error Handling
```
  onError: ({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      sendToLoggingService(graphQLErrors);
    }
    if (networkError) {
      logoutUser();
    }
  },
  
  clientState: // for local state management
  headers: // headers
  cache: // ApolloCache (apollo-cache-inmemory) or apollo-cache-persist
});
```

#Query component

```
const getPosts = gql`
  query getPosts {
    posts(order_by: { timestamp: desc }) {
      id
      subject
      content
      user {
        firstName
        lastName
      }
      timestamp
    }
  }
`;

export const PostsList = () => (
  <Query query={getPosts}>
    {({ loading, error, data }) => {
      if (loading) {
        return <div>Loading...</div>;
      }
      if (error) {
        return <div>Error</div>;
      }
      return data.posts.map(Post);
    }}
  </Query>
);


```

#Mutation component

```
<Mutation mutation={addPost}>
      {(addPost, { data }) => (
        <div>
          <button onClick={e => addPost({
            variables: {

            },
            refetchQueries: ["queryName"]
          })}>
        </div>
      )}
</Mutation>

```

## Migrate from Apollo Boost to Apollo client

[migration](https://www.apollographql.com/docs/react/advanced/boost-migration.html)

`npm install apollo-client apollo-cache-inmemory apollo-link-http apollo-link-error apollo-link --save`

```
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';

const link = new HttpLink({ uri: 'my-graphql-server' });

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

```

you can also use [apollo-cache-persist](https://github.com/apollographql/apollo-cache-persist)

### Apollo Link is a Network Layer

Check the [docs](https://www.apollographql.com/docs/react/advanced/network-layer.html#linkMiddleware) for more in depth overview

## Authentication

```
import { setContext } from 'apollo-link-context';


const httpLink = new HttpLink({
  uri: "https://graphql-on-postgres-demo.herokuapp.com/v1alpha1/graphql"
});

const authLink = setContext((_, { headers }) => {
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      "X-Hasura-access-key": "my-secret-hash",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache()
})

```

## Subscriptions

`npm install apollo-link-ws subscriptions-transport-ws apollo-utilities`

additional imports
```
import { getMainDefinition } from 'apollo-utilities';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
```

setup websocket link
```
const wsLink = new WebSocketLink({
  uri: "wss://graphql-bootcamp-sample-blog.herokuapp.com/v1alpha1/graphql",
  options: {
    reconnect: true
  }
});
```

Redirect to operation based on operation definition

```
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);
```

## Bonus

[ReactNativeWeb](https://codesandbox.io/s/xk7zw3n4)


## Hooks



# Angular

[Setup](https://www.apollographql.com/docs/angular/basics/setup.html)


```
npm install --save apollo-angular \
  apollo-angular-link-http \
  apollo-link \
  apollo-client \
  apollo-cache-inmemory \
  graphql-tag \
  graphql
```


The apollo-client package requires `AsyncIterable` so make sure your `tsconfig.json` includes `esnext.asynciterable`:

```
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
```

Setup providers

```
@NgModule({
  imports: [BrowserModule, HttpClientModule, ApolloModule, HttpLinkModule],
  providers: [{
    provide: APOLLO_OPTIONS,
    useFactory(httpLink: HttpLink) {
      return {
        cache: new InMemoryCache(),
        link: httpLink.create({
          uri: `https://graphql-bootcamp-sample-blog.herokuapp.com/v1alpha1/graphql`
        })
      }
    },
    deps: [HttpLink]
  }],
```

in component

```
  rates: any[];
  loading = true;
  error: any;
```

`constructor(private apollo: Apollo) {}`

```
  ngOnInit() {
    this.apollo
          .watchQuery({
            query: gql`
              {
                  posts(order_by: { timestamp: desc }) {
                    id
                    subject
                    content
                    user {
                      firstName
                      lastName
                    }
                    timestamp
                  }
              }
            `,
          })
        .valueChanges.subscribe(result => {
          this.posts = result.data && result.data.posts;
          this.loading = result.loading;
          this.error = result.error;
        });
}
```



[Demo](https://stackblitz.com/edit/basic-apollo-angular-app-i6ejrc)

[Docs](https://www.apollographql.com/docs/angular)

# Vue

[Demo](https://codesandbox.io/s/o1q71q63z)

[Vue Apollo](https://vue-apollo.netlify.com)

```
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
// New Imports
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
```

Same as React exept:

```
// Install the vue plugin
Vue.use(VueApollo)
```

Queries declaration

```
new Vue({
  apollo: {
    // Apollo specific options
  },
})
```

```
<template>
  <div>{{ hello }}</div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    // Simple query that will update the 'hello' vue property
    hello: gql`query {
      hello
    }`,
  },
}
</script>
```

### Mutations

```
methods: {
  async addTag() {
    // Call to the graphql mutation
    const result = await this.$apollo.mutate({
      // Query
      mutation: gql`mutation ($label: String!) {
        addTag(label: $label) {
          id
          label
        }
      }`,
      // Parameters
      variables: {
        label: this.newTag,
      },
    })
  }
}
```

# Bonus section - react-apollo-hooks
