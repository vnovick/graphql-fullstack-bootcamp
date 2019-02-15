# Input Values

```
input Draft {
  title: String!
  content: String!
  author: String!
}


type Mutation {
  createDraft(object: Draft): Post
}
```
> Input types can't have fields that are other objects, only basic scalar types, list types, and other input types.

# Custom scalars

```
const { GraphQLScalarType } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');

const myCustomScalarType = new GraphQLScalarType({
  name: 'MyCustomScalar',
  description: 'Description of my custom scalar type',
  serialize(value) {
    let result;
    // Implement your own behavior here by setting the 'result' variable 
    // value SENT to the client
    return result;
  },
  parseValue(value) {
    let result;
    // Implement your own behavior here by setting the 'result' variable
    // value FROM the client
    return result;
  },
  parseLiteral(ast) {
    switch (ast.kind) {
      // Implement your own behavior here by returning what suits your needs
      // depending on ast.kind

      // return result based on client
    }
  }
});
```
### Date scalar

```
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

const resolverMap = {
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
};
```

# Scalar validation

```
Odd: new GraphQLScalarType({
    name: 'Odd',
    description: 'Odd custom scalar type',
    parseValue: oddValue,
    serialize: oddValue,
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return oddValue(parseInt(ast.value, 10));
      }
      return null;
    },
  }),
```

# Interfaces
An Interface is an abstract type that includes a certain set of fields that a type must include to implement the interface.

```

```

# Union Types


[Interfaces and Unions](https://github.com/prisma/graphql-yoga/blob/master/examples/interface-union)
