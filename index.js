const { ApolloServer, gql } = require("apollo-server");
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
    occupation: String
    baseOfOperations: String
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
    villains(filter: AlignmentFilterInput): [Character]!
    heroes(filter: AlignmentFilterInput): [Character]!
    teams(filter: TeamFilterInput): [Character]!
  }

  input CharacterFilterInput {
    alignment: Alignment
    type: Type
    keyword: String
  }

  input AlignmentFilterInput {
    type: Type
    keyword: String
  }

  input TeamFilterInput {
    alignment: Alignment
    keyword: String
  }
`;

const ALIGNMENT_VALUES = {
  HEROES: "Heroes",
  ITS_COMPLICATED: "It's complicated",
  VILLAINS: "Villains",
};

function mapAlignment(enumValue) {
  return ALIGNMENT_VALUES[enumValue];
}

function alignmentVillains() {
  return ALIGNMENT_VALUES.VILLAINS;
}

function alignmentHeroes() {
  return ALIGNMENT_VALUES.HEROES;
}

const TYPE_VALUES = {
  INDIVIDUALS: "Individuals",
  PLACES: "Places",
  TEAMS: "Teams",
};

function mapType(enumValue) {
  return [TYPE_VALUES[enumValue]];
}

function typeTeams() {
  return [TYPE_VALUES.TEAMS];
}

function propFilter(key, filterProp, filterValue) {
  if (filterProp === undefined) {
    return {};
  }
  return { [key]: filterValue };
}

function withKeyword(partialResult, keyword) {
  if (!keyword) {
    return partialResult.value();
  }

  const lowKey = keyword.toLowerCase();
  const byText = (text) => text != null && text.toLowerCase().includes(lowKey);

  return partialResult
    .value()
    .filter(
      ({ name, alterEgo, baseOfOperations, occupation }) =>
        byText(name) ||
        byText(alterEgo) ||
        byText(baseOfOperations) ||
        byText(occupation)
    );
}
// Resolvers define the technique for fetching the types defined in the
// schema.
const resolvers = {
  Query: {
    characters: (_, { filter = {} }) => {
      const { alignment, type, keyword } = filter;
      return withKeyword(
        charactersDb
          .filter(propFilter("alignment", alignment, mapAlignment(alignment)))
          .filter(propFilter("type", type, mapType(type))),
        keyword
      );
    },
    character: (_, { name }) => {
      return charactersDb.find({ name: name.toLowerCase() }).value();
    },
    villains: (_, { filter = {} }) => {
      const { type, keyword } = filter;
      return withKeyword(
        charactersDb
          .filter({ alignment: alignmentVillains() })
          .filter(propFilter("type", type, mapType(type))),
        keyword
      );
    },
    heroes: (_, { filter = {} }) => {
      const { type, keyword } = filter;
      return withKeyword(
        charactersDb
          .filter({ alignment: alignmentHeroes() })
          .filter(propFilter("type", type, mapType(type))),
        keyword
      );
    },
    teams: (_, { filter = {} }) => {
      const { alignment, keyword } = filter;
      return withKeyword(
        charactersDb
          .filter(propFilter("alignment", alignment, mapAlignment(alignment)))
          .filter({ type: typeTeams() }),
        keyword
      );
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
