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

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase().trim();

  const channelId = message.channel.isThread()
    ? message.channel.parentId
    : message.channel.id;

  for (const group of triggerGroups) {
    if (!Array.isArray(group.triggers) || group.triggers.length === 0) continue;

    // 🚫 Blocked channels first
    if (
      Array.isArray(group.blockedChannels) &&
      group.blockedChannels.includes(channelId)
    )
      continue;

    // ✅ Allowed channels second
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
