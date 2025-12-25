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
