module.exports = [
  {
    name: "crossplay",
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
      "join on ps5",
      "ps5 join",
      "join ps5",
      "ps5 server",
      "ps5 only",
      "join on ps4",
      "ps4 join",
      "join ps4",
      "playstation join",
      "join on playstation",
      "join playstation",
      "playstation4 join",
      "playstation 4 join",
      "playstation 5 join",
      "crossplay",
      "playstation crossplay",
      "ps5 crossplay",
      "ps4 crossplay",
      "crossplay ps5",
      "crossplay ps4",
      "crossplay pc",
      "pc crossplay",
      "gamepass crossplay",
      "game pass crossplay",
      "xbox gamepass crossplay",
      "server pc only",
      "server pc only?",
      "pc only",
      "pc server only",
      "is this pc only",
      "pc exclusive",
      "steam only server",
      "gamepass join",
      "join on gamepass",
      "join with gamepass",
      "game pass join",
      "xbox gamepass join",
      "can gamepass join",
      "can ps5 join",
      "can ps4 join",
      "can playstation join",
      "can console join",
      "console crossplay",
      "does ps5 work",
      "does playstation work",
      "ps 5 join",
      "ps-5 join",
      "plaustation join",
      "playstaion join",
      "cross play",
      "cross-play",
    ],
    response: `We have enabled cross play on both Palworld servers so please play on your favorite device!`,
  },
];
