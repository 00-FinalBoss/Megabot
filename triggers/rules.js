module.exports = [
  {
    name: "Rules",
    type: "static",

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
      "rules",
      "server rules",
      "what are the rules",
      "what is the rules",
      "what are server rules",
      "what are the server rules",
      "rules of the server",
      "any rules",
      "are there rules",
      "got rules",
      "where are the rules",
      "where rules",
      "show rules",
      "can i see the rules",
      "can you show the rules",
      "what rules do you have",
      "do you have rules",
      "do you have server rules",
      "rules?",
      "rule?",
      "srv rules",
      "server rule",
      "ruls",
      "ruels",
      "rulez",
      "serer rules",
      "sever rules",
    ],
    response: `
**If you are looking for the rules of Mega's Nook:**
Please Read <#1319802325677772900>

**If you are looking for the rules of the Palworld PVE server:**
Please Read <#1450990654707470366>
`,
  },
];
