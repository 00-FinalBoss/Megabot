module.exports = [
  {
    name: "baseamount",
    type: "static",
    allowedChannels: [
      //Mega's Nook Channel IDs
      "1217596119098593384",
      "1403945676945096796",
      "1259311635001249813",
      //Mega-bot test server Channel IDs
      "1451773291151757385",
      "1451773330221699276",
      "1451773347141783682",
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
    triggers: [
      "How Many Bases can i have ",
      "How Many Bases can i have?",
      "How Many Bases can i have on the server",
      "How Many Bases can i have on the server?",
      "How Many Bases can i have on the server",
      "How Many Bases can i have on the server?",
      "How Many Bases can i have on the server",
      "How Many Bases can i have on the server?",
      "base amount",
      "base amount?",
      "base amount on the server",
      "base amount on the server?",
      "base limit",
      "base limit?",
      "base limit on the server",
      "base limit on the server?",
      "number of bases",
      "number of bases?",
      "number of bases on the server",
      "number of bases on the server?",
      "how many bases",
      "how many bases?",
      "how many bases on the server",
      "how many bases on the server?",
      "can i have multiple bases",
      "can i have multiple bases?",
      "can i have multiple bases on the server",
      "can i have multiple bases on the server?",
      "can i have more than 1 base",
      "can i have more than 1 base?",
      "can i have more than 1 base on the server",
      "can i have more than 1 base on the server?",
      "can i have more than 2 bases",
      "can i have more than 2 bases?",
      "can i have more than 2 bases on the server",
      "can i have more than 2 bases on the server?",
      "can i have 3 bases",
      "can i have 3 bases?",
      "can i have 3 bases on the server",
      "can i have 3 bases on the server?",
    ],
    response: `We allow up to 2 bases per player/guild on the server. If you have more than 2 bases, you will need to delete them to comply with the rules.`,
  },
];
