const { ApolloServer, gql } = require("apollo-server");
const charactersDb = require("./db").get("characters");

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # This "Character" type defines the queryable fields for every heroe in our data source.
  type Character {
    name: String!
    description: String!
    descriptionSummary: String
    alignment: String
    type: [String]
    facts: Facts
  }

  type Facts {
    powers: String
    alterEgo: String
    additionalInfo: [String]
    firstAppearence: Comic
  }

  type Comic {
    url: String
    title: String!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each.
  type Query {
    characters: [Character]
    character(name: String!): Character
  }
`;

// Resolvers define the technique for fetching the types defined in the
// schema.
const resolvers = {
  Query: {
    characters: () => charactersDb.value(),
    character: (_, { name }) => {
      return charactersDb.find({ name: name.toLowerCase() }).value();
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
