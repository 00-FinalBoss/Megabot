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

const fs = require("fs");
const path = require("path");

const customTriggerFile = path.join(__dirname, "data", "customTriggers.json");

let customTriggers = {};

if (fs.existsSync(customTriggerFile)) {
  customTriggers = JSON.parse(fs.readFileSync(customTriggerFile, "utf8"));
}

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
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase().trim();

  const channelId = message.channel.isThread()
    ? message.channel.parentId
    : message.channel.id;

  // ===============================
  // COMMAND: Add a new trigger
  // ===============================
  if (content.startsWith(`${PREFIX}addtrigger`)) {
    if (!message.member.permissions.has("Administrator")) {
      return message.reply(
        "❌ You do not have permission to use this command."
      );
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

    const group = triggerGroups.find((g) => g.name.toLowerCase() === groupName);

    if (!group) {
      return message.reply(`❌ Trigger group **${groupName}** not found.`);
    }

    if (group.triggers.includes(newTrigger)) {
      return message.reply("⚠️ That trigger already exists.");
    }

    group.triggers.push(newTrigger);

    if (!customTriggers[group.name]) {
      customTriggers[group.name] = [];
    }

    customTriggers[group.name].push(newTrigger);

    fs.writeFileSync(
      customTriggerFile,
      JSON.stringify(customTriggers, null, 2)
    );

    await message.reply(
      `✅ Added trigger **"${newTrigger}"** to **${group.name}**`
    );
    return;
  }

  // ===============================
  // NORMAL TRIGGER RESPONSES
  // ===============================
  for (const group of triggerGroups) {
    if (customTriggers[group.name]) {
      group.triggers.push(...customTriggers[group.name]);
    }
    if (!Array.isArray(group.triggers) || group.triggers.length === 0) continue;

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

    const matched = group.triggers.some(
      (trigger) =>
        typeof trigger === "string" &&
        trigger.length > 1 &&
        content.includes(trigger)
    );

    if (!matched) continue;

    if (group.type === "random") {
      const response =
        group.responses[Math.floor(Math.random() * group.responses.length)];
      await message.reply(response);
      return;
    } else {
      await message.reply(group.response);
      return;
    }

    return;
  }
});

client.login(process.env.TOKEN);
