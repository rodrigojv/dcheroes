// Setup the DB
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("dcheroes.json");
const db = low(adapter);
db.defaults({ heroes: [] }).write();

module.exports = db;
