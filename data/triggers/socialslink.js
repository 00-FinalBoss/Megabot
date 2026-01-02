module.exports = [
  {
    name: "socialslink",
    type: "static",

    allowedChannels: [
      //Mega's Nook Channel IDs
      "1417657655924621392",
      //Mega-bot test server Channel IDs
      "1451773291151757385",
    ],

    blockedChannels: [
      //Mega's Nook Channel IDs
      "478386113938063371", //welcome
      "1289633790095921212", //mod-view
      "1406169487387918387", // chat commands
      "478386069847539712", //anoucements
      "1417657655924621392", //mega-links
      "478389169291264007", //bot spam
      "1294442455307124818", //auto-moderation
      "1394880995995422800", //reminders

      //Mega-bot test server Channel IDs
      "1451773330221699276", //channel 1
      "1451773347141783682", //channel 2
    ],
    triggers: ["1234"],
    response: `
🔗 Connect with Megabits

👕 [Merchandise](<https://megabitsshop.store/>)

📸 [Instagram](<https://www.instagram.com/megabits_yt?igsh=MzRlODBiNWFlZA==>)

🐦 [Twitter / X](<https://x.com/Mega_Bits_>)

🔴 [YouTube](<https://www.youtube.com/@Megabits>)

💜 [Twitch](<https://www.twitch.tv/mega_bitse>)

📱 [TikTok](<https://www.tiktok.com/@mega_bits_>)

🦋 [Bluesky](<https://bsky.app/profile/megabitss.bsky.social>)

🎁 [Throne](<https://throne.com/megabits>)

Here's a spot for all MegaBits' links! These are the only places to find me! 
If you find another account with my name that isn't here, it isn't me!
`,
  },
];
