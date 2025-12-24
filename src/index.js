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

  const content = message.content.toLowerCase();
  const channelId = message.channel.id;

  for (const group of triggerGroups) {
    if (group.allowedChannels && !group.allowedChannels.includes(channelId))
      continue;

    if (!group.triggers.some((t) => content.includes(t))) continue;

    if (group.type === "random") {
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
