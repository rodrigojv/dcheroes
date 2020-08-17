const { ApolloServer, gql } = require("apollo-server");
const heroesDb = require("./db");

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Heroe" type defines the queryable fields for every heroe in our data source.
  type Heroe {
    descriptionSummary: String
    description: String
    name: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each.
  type Query {
    heroes: [Heroe]
  }
`;

// Resolvers define the technique for fetching the types defined in the
// schema.
const resolvers = {
  Query: {
    heroes: () => heroesDb.get("heroes").value(),
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
