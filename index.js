const { ApolloServer, gql, FilterTypes } = require("apollo-server");
const charactersDb = require("./db").get("characters");

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  enum Alignment {
    VILLAINS
    HEROES
    ITS_COMPLICATED
  }

  enum Type {
    INDIVIDUALS
    PLACES
    TEAMS
  }

  # This "Character" type defines the queryable fields for every heroe in our data source.
  type Character {
    name: String!
    description: String!
    descriptionSummary: String
    alignment: String
    type: [String]
    powers: String
    alterEgo: String
    additionalInfo: [String]
    firstAppearence: Comic!
  }

  type Comic {
    url: String
    title: String!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each.
  type Query {
    characters(filter: CharacterFilterInput): [Character]!
    character(name: String!): Character
  }

  input StringQueryOperatorInput {
    eq: String
    ne: String
    in: [String]
    nin: [String]
    regex: String
    glob: String
  }

  input CharacterFilterInput {
    firstLetter: String
    alignment: Alignment
    type: Type
    name: StringQueryOperatorInput
  }
`;

function mapAlignment(enumValue) {
  const ALIGNMENT_VALUES = {
    HEROES: "Heroes",
    COMPLICATED: "It's complicated",
    VILLAINS: "Villains",
  };
  return ALIGNMENT_VALUES[enumValue];
}

function mapType(enumValue) {
  const TYPE_VALUES = {
    INDIVIDUALS: "Individuals",
    PLACES: "Places",
    TEAMS: "Teams",
  };
  return [TYPE_VALUES[enumValue]];
}

function propFilter(key, filterProp, filterValue) {
  if (filterProp === undefined) {
    return {};
  }
  return { [key]: filterValue };
}

// Resolvers define the technique for fetching the types defined in the
// schema.
const resolvers = {
  Query: {
    characters: (_, { filter = {} }) => {
      const { alignment, type } = filter;
      return charactersDb
        .filter(propFilter("alignment", alignment, mapAlignment(alignment)))
        .filter(propFilter("type", type, mapType(type)))
        .value();
    },
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
