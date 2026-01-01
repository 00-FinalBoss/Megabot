//Discord Bot for Mega's Nook and Palworld PVE Server
//Version 1.0.6
//created by Charles C. (Final_Bosss#7689)
//AI assisted improvements by ChatGPT & GitHub Copilot

require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

require("dotenv").config();

const ADMIN_ROLE_IDS = process.env.ADMIN_ROLE_IDS?.split(",").map((id) =>
  id.trim()
);

const PREFIX = "!";

const rules = require("./triggers/rules");
const paltransfer = require("./triggers/paltransfer");
const join = require("./triggers/join");
const crossplay = require("./triggers/crossplay");
const basemount = require("./triggers/baseamount");
const praise = require("./triggers/praise");
const socials = require("./triggers/socials");
const socialslink = require("./triggers/socialslink");

const triggerGroups = [
  ...rules,
  ...paltransfer,
  ...join,
  ...crossplay,
  ...basemount,
  ...praise,
  ...socials,
  ...socialslink,
];

const db = require("./db");

// ===============================
// LOAD SQLITE TRIGGERS (ONCE)
// ===============================
const dbTriggers = db
  .prepare("SELECT group_name, trigger FROM additional_triggers")
  .all();

for (const row of dbTriggers) {
  const group = triggerGroups.find(
    (g) =>
      typeof g.name === "string" &&
      g.name.toLowerCase() === row.group_name.toLowerCase()
  );

  if (!group) continue;

  group.additionalTriggers ??= [];
  group.additionalTriggers.push(row.trigger);
}

console.log(`Loaded ${dbTriggers.length} additional triggers from SQLite`);

// ===============================
// MESSAGE HANDLER
// ===============================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase().trim();

  const channelId = message.channel.isThread()
    ? message.channel.parentId
    : message.channel.id;

  // ADMIN: ADD TRIGGER
  if (content.startsWith(`${PREFIX}addtrigger`)) {
    const hasAdminRole = ADMIN_ROLE_IDS?.some((id) =>
      message.member?.roles.cache.has(id)
    );

    const hasPermission =
      hasAdminRole || message.member?.permissions.has("Administrator");

    if (!hasPermission) {
      return message.reply("❌ You do not have permission.");
    }

    const args = content.slice(`${PREFIX}addtrigger`.length).trim().split(" ");
    const groupName = args.shift();
    const trigger = args.join(" ").trim();

    if (!groupName || !trigger) {
      return message.reply(
        "Usage: `!addtrigger <group-name> <trigger phrase>`"
      );
    }

    const group = triggerGroups.find(
      (g) => g.name?.toLowerCase() === groupName
    );

    if (!group) {
      return message.reply(`❌ Group "${groupName}" not found.`);
    }

    group.additionalTriggers ??= [];

    if (group.additionalTriggers.includes(trigger)) {
      return message.reply("⚠️ Trigger already exists.");
    }

    db.prepare(
      "INSERT INTO additional_triggers (group_name, trigger) VALUES (?, ?)"
    ).run(group.name, trigger);

    group.additionalTriggers.push(trigger);

    return message.reply(`✅ Trigger "${trigger}" added to **${group.name}**`);
  }

  // NORMAL TRIGGERS
  for (const group of triggerGroups) {
    if (
      Array.isArray(group.blockedChannels) &&
      group.blockedChannels.includes(channelId)
    )
      continue;

    if (
      Array.isArray(group.allowedChannels) &&
      !group.allowedChannels.includes(channelId)
    )
      continue;

    const allTriggers = [
      ...(group.triggers ?? []),
      ...(group.additionalTriggers ?? []),
    ];

    if (!allTriggers.length) continue;

    const matched = allTriggers.some((t) => content.includes(t));
    if (!matched) continue;

    if (group.type === "random") {
      const response =
        group.responses[Math.floor(Math.random() * group.responses.length)];
      return message.reply(response);
    } else {
      return message.reply(group.response);
    }
  }
});

client.login(process.env.TOKEN);
