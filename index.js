// ========================================================
//  Discord Bot for Mega's Nook and Palworld PVE Server
//  Version 1.1.0
//  created by Charles C. (Final_Bosss#7689)
//  AI assisted improvements by ChatGPT & GitHub Copilot
//  AI Debugging help by Chat GPT
// ========================================================

require("dotenv").config();
const { Client, IntentsBitField, Partials } = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.DirectMessages, // ✅ REQUIRED FOR DMs
    IntentsBitField.Flags.MessageContent,
  ],
  partials: [Partials.Channel], // ✅ REQUIRED FOR DM channels
});

require("dotenv").config();

const ADMIN_ROLE_IDS = process.env.ADMIN_ROLE_IDS?.split(",").map((id) =>
  id.trim()
);

const PREFIX = "!";

const FANMAIL_CHANNEL_ID = process.env.FANMAIL_CHANNEL_ID;

const TICKET_CHANNEL_ID = process.env.TICKET_CHANNEL_ID;

// ========================================================
// LOAD TRIGGER GROUPS
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

const db = require("./data/db");

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

  // ===============================
  // FAN-MAIL (DM ONLY, 1 PER WEEK)
  // ===============================
  if (!message.guild) {
    const raw = message.content.trim();

    if (!raw.toLowerCase().startsWith("fanmail")) return;

    const fanMailMessage = raw.slice("fanmail".length).trim();

    if (!fanMailMessage) {
      return message.reply(
        "❌ Please include a message.\nExample:\n`fanmail I love the server!`"
      );
    }
    // ===================
    // Weekly limit check
    // ===================
    const lastFanMail = db
      .prepare(
        `
      SELECT created_at
      FROM fanmail
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `
      )
      .get(message.author.id);

    if (lastFanMail) {
      const lastTime = new Date(lastFanMail.created_at).getTime();
      const oneWeek = 7 * 24 * 60 * 60 * 1000;

      if (Date.now() - lastTime < oneWeek) {
        return message.reply(
          "⏱️ You can only send **one fan-mail per week**.\nThanks for the support ❤️"
        );
      }
    }

    const fanMailChannel = client.channels.cache.get(FANMAIL_CHANNEL_ID);
    if (!fanMailChannel) {
      return message.reply("❌ Fan-mail channel not found.");
    }

    // =======================
    // 1️⃣ Send message FIRST
    // =======================
    const sentMessage = await fanMailChannel.send({
      content:
        `💌 **New Fan-Mail**\n` +
        `👤 **From:** ${message.author} (${message.author.id})\n\n` +
        `📝 **Message:**\n${fanMailMessage}`,
    });

    // =======================
    // 2️⃣ THEN save to DB
    // =======================
    db.prepare(
      "INSERT INTO fanmail (user_id, message, message_id) VALUES (?, ?, ?)"
    ).run(message.author.id, fanMailMessage, sentMessage.id);

    // =======================
    // 3️⃣ Confirm to user
    // =======================
    return message.reply(
      "❤️ Thank you for the fan-mail! It’s been sent privately."
    );
  }

  // ===============================
  // ADMIN: ADD
  // ===============================
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
  // ===============================
  // TICKET LIMIT (MAX 3 OPEN)
  // ===============================
  const openTicketCount = db
    .prepare(
      "SELECT COUNT(*) AS count FROM tickets WHERE user_id = ? AND status = 'open'"
    )
    .get(message.author.id).count;

  if (openTicketCount >= 3) {
    return message.reply(
      `❌ You already have **${openTicketCount} open tickets**.\nPlease wait for staff to close one before creating another.`
    );
  }
  // ===============================
  // USER: CREATE TICKET (NO THREADS)
  // ===============================
  if (content.startsWith(`${PREFIX}ticket`)) {
    const ticketMessage = message.content
      .slice(`${PREFIX}ticket`.length)
      .trim();

    if (!ticketMessage) {
      return message.reply(
        "❌ Please include a message.\nExample: `!ticket I need help joining the server`"
      );
    }

    const ticketChannel = message.guild.channels.cache.get(
      process.env.TICKET_CHANNEL_ID
    );

    if (!ticketChannel) {
      return message.reply("❌ Ticket channel not found.");
    }

    const messageLink = `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;

    try {
      const result = db
        .prepare(
          `INSERT INTO tickets (user_id, channel_id, message)
         VALUES (?, ?, ?)`
        )
        .run(message.author.id, message.channel.id, ticketMessage);

      const ticketId = result.lastInsertRowid;

      await ticketChannel.send({
        content:
          `🎫 **New Ticket #${ticketId}**\n` +
          `👤 **User:** ${message.author} (${message.author.id})\n` +
          `📍 **Channel:** <#${message.channel.id}>\n` +
          `🔗 **Original Message:** [Jump to message](${messageLink})\n\n` +
          `📝 **Message:**\n${ticketMessage}`,
      });

      return message.reply("✅ Your ticket has been sent to staff.");
    } catch (err) {
      console.error("Ticket creation failed:", err);
      return message.reply("❌ Failed to submit ticket. Please notify staff.");
    }
  }
  // ===============================
  // STAFF: CLOSE TICKET
  // ===============================
  if (content.startsWith(`${PREFIX}closeticket`)) {
    const hasAdminRole = ADMIN_ROLE_IDS?.some((id) =>
      message.member?.roles.cache.has(id)
    );

    const hasPermission =
      hasAdminRole || message.member?.permissions.has("Administrator");

    if (!hasPermission) {
      return message.reply("❌ You do not have permission.");
    }

    const args = content.split(" ");
    const ticketId = Number(args[1]);

    if (!ticketId) {
      return message.reply("Usage: `!closeticket <ticket-id>`");
    }

    const result = db
      .prepare(
        "UPDATE tickets SET status = 'closed' WHERE id = ? AND status != 'closed'"
      )
      .run(ticketId);

    if (result.changes === 0) {
      return message.reply("⚠️ Ticket not found or already closed.");
    }

    return message.reply(`✅ Ticket #${ticketId} has been closed.`);
  }
  // ===============================
  // STAFF: DELETE TICKET
  // ===============================
  if (content.startsWith(`${PREFIX}deleteticket`)) {
    const hasAdminRole = ADMIN_ROLE_IDS?.some((id) =>
      message.member?.roles.cache.has(id)
    );

    const hasPermission =
      hasAdminRole || message.member?.permissions.has("Administrator");

    if (!hasPermission) {
      return message.reply("❌ You do not have permission.");
    }

    const args = content.split(" ");
    const ticketId = Number(args[1]);

    if (!ticketId) {
      return message.reply("Usage: `!deleteticket <ticket-id>`");
    }

    const result = db.prepare("DELETE FROM tickets WHERE id = ?").run(ticketId);

    if (result.changes === 0) {
      return message.reply("⚠️ Ticket not found.");
    }

    return message.reply(`🗑️ Ticket #${ticketId} has been deleted.`);
  }
  // ===============================
  // NORMAL TRIGGERS
  // ===============================
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

// ===============================
// FAN-MAIL AUTO DELETE (7 DAYS)
// ===============================
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

async function cleanupFanMail() {
  try {
    const expired = db
      .prepare(
        `
      SELECT id, message_id
      FROM fanmail
      WHERE created_at <= datetime('now', '-7 days')
    `
      )
      .all();

    if (!expired.length) return;

    const fanMailChannel = client.channels.cache.get(FANMAIL_CHANNEL_ID);
    if (!fanMailChannel) return;

    for (const mail of expired) {
      try {
        const msg = await fanMailChannel.messages.fetch(mail.message_id);
        await msg.delete();
      } catch {
        // Message already deleted or not accessible
      }

      db.prepare("DELETE FROM fanmail WHERE id = ?").run(mail.id);
    }

    console.log(`🧹 Cleaned up ${expired.length} fan-mail messages`);
  } catch (err) {
    console.error("Fan-mail cleanup failed:", err);
  }
}

// ===============================
// Bot Login Token
// ===============================
client.login(process.env.TOKEN);

// ===============================
// Schedule it (safe interval)
// ===============================
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  // =======================
  // Run once on startup
  // =======================
  cleanupFanMail();
  // =======================
  // Then every 6 hours
  // =======================
  setInterval(cleanupFanMail, 6 * 60 * 60 * 1000);
});
