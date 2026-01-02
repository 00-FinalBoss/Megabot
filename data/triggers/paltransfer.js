module.exports = [
  {
    name: "Pal Transfer",
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
      "pal transfer?",
      "pal transfer",
      "global pal transfer",
      "global pal transfer?",
      "transfer pals",
      "transfer pal",
      "pal transfer rules",
      "pal transfer policy",
      "pal transfer policy?",
      "pal transfer rules?",
      "transferring pals allowed",
      "transferring pals allowed?",
      "can i transfer my pal",
      "can i transfer my pal?",
      "can i transfer my pal to another server",
      "can i transfer my pal to another server?",
      "can i transfer my pal to another server",
      "can i download pals",
      "can i upload pals",
      "can i download my pal",
      "can i upload my pal",
      "can i download my pal?",
      "can i upload my pal?",
      "can i download my pal from another server",
      "can i upload my pal to another server",
      "can i download my pal from another server?",
      "can i upload my pal to another server?",
      "can i download my pal from another server",
      "can i upload my pal to another server?",
      "can i download my pal from another server",
      "can i upload my pal to another server",
    ],
    response: `
For Palworld PVE servers it is allowed to download and upload pals as long as they able to be obtain through normal gameplay, 
any illegal/genned pal will face disciplinary actions up to permanently being banned 

For Palworld PVP servers it is only allowed to upload pals as the server will reset between seasons. no downloading of pals is allowed.`,
  },
];
