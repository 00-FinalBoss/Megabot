const Database = require("better-sqlite3");
const db = new Database("./data/bot.db");

// ===============================
// Custom Triggers
// ===============================
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS additional_triggers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_name TEXT NOT NULL,
    trigger TEXT NOT NULL
  )
`
).run();

// ===============================
// Tickets
// ===============================
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    channel_id TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`
).run();

// ===============================
// Fan-Mail
// ===============================
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS fanmail (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    message TEXT NOT NULL,
    message_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`
).run();

console.log("SQLite tables initialized");

module.exports = db;
