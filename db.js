// Setup the DB
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("dcheroes.json");
const db = low(adapter);
db.defaults({
  characters: [],
  alignments: {
    44072: "Heroes",
    44074: "It's complicated",
    44073: "Villains",
  },
  types: {
    44070: "Individuals",
    79397: "Places",
    44071: "Teams",
  },
}).write();

module.exports = db;
