const data = require("./api_data/page_08.json");
const db = require("./db");

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
// console.log({ heroes });

// heroes.forEach((h) => db.get("heroes").push(h).write());
