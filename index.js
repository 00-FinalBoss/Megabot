// ========================================================
//  Discord Bot for Mega's Nook and Palworld PVE Server
//  Version 1.1.4 (STABLE)
// ========================================================

require("dotenv").config();
const { Client, IntentsBitField, Partials } = require("discord.js");
const db = require("./data/db");

// ========================================================
// CLIENT
// ========================================================
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.MessageContent,
  ],
  partials: [Partials.Channel],
});

// ========================================================
// CONFIG
// ========================================================
const PREFIX = "!";

const ADMIN_ROLE_IDS = process.env.ADMIN_ROLE_IDS?.split(",").map((id) =>
  id.trim()
);

const FANMAIL_CHANNEL_IDS = process.env.FANMAIL_CHANNEL_IDS?.split(",")
  .map((id) => id.trim())
  .filter(Boolean);

const TICKET_CHANNEL_IDS = process.env.TICKET_CHANNEL_IDS?.split(",")
  .map((id) => id.trim())
  .filter(Boolean);

// ========================================================
// LOAD TRIGGERS
// ========================================================
const rules = require("./data/triggers/rules");
const paltransfer = require("./data/triggers/paltransfer");
const join = require("./data/triggers/join");
const crossplay = require("./data/triggers/crossplay");
const basemount = require("./data/triggers/baseamount");
const praise = require("./data/triggers/praise");
const socials = require("./data/triggers/socials");
const socialslink = require("./data/triggers/socialslink");

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

// ========================================================
// LOAD SQLITE TRIGGERS
// ========================================================
const dbTriggers = db
  .prepare("SELECT group_name, trigger FROM additional_triggers")
  .all();

for (const row of dbTriggers) {
  const group = triggerGroups.find(
    (g) => g.name?.toLowerCase() === row.group_name.toLowerCase()
  );
  if (!group) continue;

  group.additionalTriggers ??= [];
  group.additionalTriggers.push(row.trigger);
}

console.log(`Loaded ${dbTriggers.length} additional triggers`);

// ========================================================
// MESSAGE HANDLER
// ========================================================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const raw = message.content.trim();
  const content = raw.toLowerCase();

  const channelId = message.channel.isThread()
    ? message.channel.parentId
    : message.channel.id;

  // ======================================================
  // DM COMMANDS
  // ======================================================
  if (!message.guild) {
    // ---------------- FANMAIL ----------------
    if (content.startsWith("fanmail")) {
      const text = raw.slice(7).trim();
      if (!text) return message.reply("❌ `fanmail <message>`");

      const last = db
        .prepare(
          `
        SELECT created_at FROM fanmail
        WHERE user_id = ?
        ORDER BY created_at DESC LIMIT 1
      `
        )
        .get(message.author.id);

      if (last && Date.now() - new Date(last.created_at) < 7 * 86400000) {
        return message.reply("⏱️ One fan-mail per week.");
      }

      const insert = db.prepare(`
        INSERT INTO fanmail (user_id, message, message_id)
        VALUES (?, ?, 'pending')
      `);
      const result = insert.run(message.author.id, text);
      const fanmailId = result.lastInsertRowid;

      let savedMessageId = null;

      for (const id of FANMAIL_CHANNEL_IDS) {
        const ch = client.channels.cache.get(id);
        if (!ch) continue;

        const sent = await ch.send({
          content: `💌 **Fan-Mail**\n👤 ${message.author}\n\n${text}`,
        });

        if (!savedMessageId) savedMessageId = sent.id;
      }

      if (!savedMessageId) {
        db.prepare("DELETE FROM fanmail WHERE id = ?").run(fanmailId);
        return message.reply("❌ Fan-mail failed.");
      }

      db.prepare("UPDATE fanmail SET message_id = ? WHERE id = ?").run(
        savedMessageId,
        fanmailId
      );

      return message.reply("❤️ Fan-mail sent.");
    }

    // ---------------- TICKET ----------------
    if (content.startsWith("!ticket") || content === "ticket") {
      const text = raw
        .replace(/^!ticket/i, "")
        .replace(/^ticket/i, "")
        .trim();
      if (!text) return message.reply("❌ `!ticket <message>`");

      const openCount = db
        .prepare(
          `
        SELECT COUNT(*) AS count
        FROM tickets
        WHERE user_id = ? AND status = 'open'
      `
        )
        .get(message.author.id).count;

      if (openCount >= 3) return message.reply("❌ Max 3 open tickets.");

      const result = db
        .prepare(
          `
        INSERT INTO tickets (user_id, channel_id, message)
        VALUES (?, 'DM', ?)
      `
        )
        .run(message.author.id, text);

      const ticketId = result.lastInsertRowid;

      for (const id of TICKET_CHANNEL_IDS) {
        const ch = client.channels.cache.get(id);
        if (!ch) continue;

        await ch.send({
          content:
            `🎫 **Ticket #${ticketId}**\n` +
            `👤 ${message.author} (${message.author.id})\n\n` +
            text,
        });
      }

      return message.reply("✅ Ticket submitted.");
    }

    return message.reply("❓ Unknown DM command.");
  }

  // ======================================================
  // ADMIN CHECK
  // ======================================================
  const isAdmin =
    message.member?.permissions.has("Administrator") ||
    ADMIN_ROLE_IDS?.some((id) => message.member.roles.cache.has(id));

  // ======================================================
  // CLOSE TICKET
  // ======================================================
  if (content.startsWith(`${PREFIX}closeticket`)) {
    if (!isAdmin) return message.reply("❌ No permission.");

    const id = Number(content.split(" ")[1]);
    if (!id) return message.reply("Usage: `!closeticket <id>`");

    const res = db
      .prepare(
        `
      UPDATE tickets SET status = 'closed'
      WHERE id = ? AND status = 'open'
    `
      )
      .run(id);

    return res.changes
      ? message.reply(`✅ Ticket #${id} closed.`)
      : message.reply("⚠️ Ticket not found.");
  }

  // ======================================================
  // DELETE TICKET
  // ======================================================
  if (content.startsWith(`${PREFIX}deleteticket`)) {
    if (!isAdmin) return message.reply("❌ No permission.");

    const id = Number(content.split(" ")[1]);
    if (!id) return message.reply("Usage: `!deleteticket <id>`");

    const res = db.prepare("DELETE FROM tickets WHERE id = ?").run(id);

    return res.changes
      ? message.reply(`🗑️ Ticket #${id} deleted.`)
      : message.reply("⚠️ Ticket not found.");
  }

  // ======================================================
  // DELETE TRIGGER
  // ======================================================
  if (content.startsWith(`${PREFIX}deltrigger`)) {
    if (!isAdmin) return message.reply("❌ No permission.");

    const [, groupName, ...rest] = content.split(" ");
    const trigger = rest.join(" ");

    const group = triggerGroups.find(
      (g) => g.name?.toLowerCase() === groupName
    );
    if (!group) return message.reply("❌ Group not found.");

    group.additionalTriggers ??= [];
    if (!group.additionalTriggers.includes(trigger)) {
      return message.reply("⚠️ Trigger not found.");
    }

    db.prepare(
      `
      DELETE FROM additional_triggers
      WHERE group_name = ? AND trigger = ?
    `
    ).run(group.name, trigger);

    group.additionalTriggers = group.additionalTriggers.filter(
      (t) => t !== trigger
    );

    return message.reply("🗑️ Trigger removed.");
  }

  // ======================================================
  // NORMAL TRIGGERS
  // ======================================================
  for (const group of triggerGroups) {
    if (group.blockedChannels?.includes(channelId)) continue;
    if (group.allowedChannels && !group.allowedChannels.includes(channelId))
      continue;

    const triggers = [
      ...(group.triggers ?? []),
      ...(group.additionalTriggers ?? []),
    ];

    if (!triggers.some((t) => content.includes(t))) continue;

    if (group.type === "random") {
      const r =
        group.responses[Math.floor(Math.random() * group.responses.length)];
      return message.reply(r);
    }

    return message.reply(group.response);
  }
});

// ========================================================
// FANMAIL CLEANUP
// ========================================================
async function cleanupFanMail() {
  const expired = db
    .prepare(
      `
    SELECT id, message_id
    FROM fanmail
    WHERE created_at <= datetime('now','-7 days')
  `
    )
    .all();

  for (const mail of expired) {
    for (const id of FANMAIL_CHANNEL_IDS) {
      const ch = client.channels.cache.get(id);
      if (!ch) continue;
      try {
        const msg = await ch.messages.fetch(mail.message_id);
        await msg.delete();
      } catch {}
    }
    db.prepare("DELETE FROM fanmail WHERE id = ?").run(mail.id);
  }
}

// ========================================================
// READY
// ========================================================
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  cleanupFanMail();
  setInterval(cleanupFanMail, 6 * 60 * 60 * 1000);
});

client.login(process.env.TOKEN);
