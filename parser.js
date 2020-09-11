const data = require("./api_data/page_08.json");
const db = require("./db");
const scraper = require("./scraper");

function parseData() {
  const results = data.results;
  const heroes = Object.keys(results)
    .map((id) => results[id])
    .map(({ fields }) => fields)
    .map((field) => {
      return {
        searchApiId: field.search_api_id,
        descriptionSummary:
          field["body:summary"].length > 0 ? field["body:summary"][0] : null,
        description:
          field["body:value"].length > 0 ? field["body:value"][0] : null,
        name: field.title.length > 0 ? field.title[0] : null,
        created: field.created,
        authorApiId: field.author,
        relatedCharactersApiId: field.field_related_characters,
      };
    });

  heroes.forEach((h) => db.get("characters").push(h).write());
}

function parseFactsFromUrls() {
  const results = data.results;
  const characters = Object.keys(results)
    .map((id) => results[id])
    .map(({ fields }) => fields)
    .map((field) => {
      return {
        url: field.url,
        searchApiId: field.search_api_id,
      };
    });
  const dbCharacters = db.get("characters");
  characters.forEach(async (c) => {
    const facts = await scraper.getCharacterFacts(c.url);
    dbCharacters
      .find({ searchApiId: c.searchApiId })
      .set("facts", facts)
      .write();
  });
}

function parseTypeAndAlignments() {
  const results = data.results;
  const characters = Object.keys(results)
    .map((id) => results[id])
    .map(({ fields }) => fields)
    .map((field) => {
      return {
        type: field.field_character_type || [], //array
        alignment: field.field_character_alignment,
        searchApiId: field.search_api_id,
      };
    });
  const dbCharacters = db.get("characters");
  characters.forEach(async (c) => {
    const type = c.type.map((t) => db.get("types").value()[t]);
    const alignment = db.get("alignments").value()[c.alignment];
    dbCharacters.find({ searchApiId: c.searchApiId }).set("type", type).write();
    dbCharacters
      .find({ searchApiId: c.searchApiId })
      .set("alignment", alignment)
      .write();
  });
}

function aplanarFacts() {
  const charactersDb = db.get("characters");
  const ids = charactersDb.map("searchApiId").value();
  ids.forEach((searchApiId) => {
    const characterRow = charactersDb.find({ searchApiId: searchApiId });
    const facts = characterRow.value().facts;
    Object.keys(facts).forEach((key) => {
      characterRow.set(key, facts[key]).write();
    });

    characterRow.unset("facts").write();
  });
}

function capitalizeName(name) {
  if (name.includes(" ")) {
    return capitalizeWords(name);
  } else if (name.includes(".")) {
    // initials
    return capitalizeWords(name, ".");
  }
  return capitalizeWord(name);
}
function capitalizeWords(name, split = " ") {
  const words = name.split(split);
  return words.map(capitalizeWord).map(specialCase).join(split);
}
function specialCase(name) {
  if (name.toLowerCase() === "fbp:") {
    return name.toUpperCase();
  }
  return name;
}
function capitalizeWord([letter, ...rest]) {
  return [letter && letter.toUpperCase(), ...rest].join("");
}
function capitalizeNames() {
  const charactersDb = db.get("characters");
  const ids = charactersDb.map("searchApiId").value();
  ids.forEach((searchApiId) => {
    const characterRow = charactersDb.find({ searchApiId: searchApiId });
    const name = characterRow.value().name;
    characterRow.set("name", capitalizeName(name)).write();
  });
}

// console.log(capitalizeName("h.i.v.e."));
// console.log(capitalizeName("birds of prey"));
// console.log(capitalizeName("superman"));
// console.log(capitalizeName("earth-48"));
// console.log(capitalizeName("captain marvel jr."));
// console.log(capitalizeName("fbp: federal bureau of physics"));
// console.log(capitalizeName("ra's al ghul"));
capitalizeNames();
