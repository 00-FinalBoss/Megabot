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

const rules = require("./triggers/rules");
const paltransfer = require("./triggers/paltransfer");
const join = require("./triggers/join");
const crossplay = require("./triggers/crossplay");
const basemount = require("./triggers/baseamount");
const praise = require("./triggers/praise");

const triggerGroups = [
  ...rules,
  ...paltransfer,
  ...join,
  ...crossplay,
  ...basemount,
  ...praise,
];

const PREFIX = "!";

//
//
//
//
// COMMAND: Add a new trigger dynamically
if (content.startsWith(`${PREFIX}addtrigger`)) {
  // Optional: restrict who can do this
  if (!message.member.permissions.has("Administrator")) {
    return message.reply("❌ You do not have permission to use this command.");
  }

  const args = message.content.slice(`${PREFIX}addtrigger`.length).trim();

  if (!args.includes("|")) {
    return message.reply(
      "❌ Format: `!addtrigger <groupName> | <trigger phrase>`"
    );
  }

  const [groupName, newTrigger] = args
    .split("|")
    .map((s) => s.trim().toLowerCase());

  if (!groupName || !newTrigger) {
    return message.reply("❌ Invalid group name or trigger.");
  }

  const group = triggerGroups.find((g) => g.name.toLowerCase() === groupName);

  if (!group) {
    return message.reply(`❌ Trigger group **${groupName}** not found.`);
  }

  if (group.triggers.includes(newTrigger)) {
    return message.reply("⚠️ That trigger already exists.");
  }

  group.triggers.push(newTrigger);

  return message.reply(
    `✅ Added trigger **"${newTrigger}"** to **${group.name}**`
  );
}

//
//
//
//
// Bot Reply Logic
client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase().trim();

  const channelId = message.channel.isThread()
    ? message.channel.parentId
    : message.channel.id;

  for (const group of triggerGroups) {
    if (!Array.isArray(group.triggers) || group.triggers.length === 0) continue;

    //Blocked channels first
    if (
      Array.isArray(group.blockedChannels) &&
      group.blockedChannels.includes(channelId)
    )
      continue;

    //Allowed channels second
    if (
      Array.isArray(group.allowedChannels) &&
      !group.allowedChannels.includes(channelId)
    )
      continue;

    const matched = group.triggers.some(
      (trigger) =>
        typeof trigger === "string" &&
        trigger.trim().length > 1 &&
        content.includes(trigger.toLowerCase().trim())
    );

    if (!matched) continue;

    if (group.type === "random") {
      if (!Array.isArray(group.responses) || group.responses.length === 0)
        return;

      const response =
        group.responses[Math.floor(Math.random() * group.responses.length)];
      message.reply(response);
    } else {
      message.reply(group.response);
    }

    return;
  }
});

client.login(process.env.TOKEN);
