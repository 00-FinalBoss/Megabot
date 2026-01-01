const Database = require("better-sqlite3");

// IMPORTANT: use process.cwd() so it works on Nexus
const db = new Database(`${process.cwd()}/triggers.db`);

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS additional_triggers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_name TEXT NOT NULL,
    trigger TEXT NOT NULL
  )
`
).run();

module.exports = db;
