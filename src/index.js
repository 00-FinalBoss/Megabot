require('dotenv').config();

const { Client, IntentsBitField } = require ('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

// Define the trigger phrases
const triggerResponses = [
  {
    name: 'Joining the server',
    allowedChannels: [
      '1217596119098593384',
      '1450990654707470366',
      '1403945676945096796'
    ],
    // Replace with the actual channel IDs
    //Group 1: Joing the server
    triggers: [
        'how do i join','how can i join','how to join','how do i join the server','how do i join this server','how can i join the server','how to join the server',
        'join server','joining','join this server','join the server','how join','how join server','how i join','how can i get in','how do i get in',
        'get in server','getting in','can i join','can i join?','can i join this','can i join the server','am i able to join','is this open to join',
        'how do i jon','how do i joiin','how to jon','joing server','joinig','server ip','what is the ip','ip address','server address'
    ],
    response: `
**If you are looking to join the Palworld PVE server:**
Please Read <#1450990654707470366>

Also check out ⁠<#1336163521616019477> for the latest Palworld server updates`
//**If you are looking to join the Palworld PVP server:**
//Please Read ⁠<#1403945676945096796>
  },
{
    name: 'Rules',
    // Replace with the actual channel IDs
    //Group 2: Rules
    triggers: [
        'rules','server rules','what are the rules','what is the rules','what are server rules','what are the server rules','rules of the server',
        'any rules','are there rules','got rules','where are the rules','where rules','show rules','can i see the rules','can you show the rules',
        'what rules do you have','do you have rules','do you have server rules','rules?','rule?','srv rules','server rule','ruls','ruels','rulez',
        'serer rules','sever rules'
    ],

    response: `
**If you are looking for the rules of Mega's Nook:**
Please Read <#1319802325677772900>

**If you are looking for the rules of the Palworld PVE server:**
Please Read <#1450990654707470366>
`
//**If you are looking for the rules of the Palworld PVP server:**
//Please Read ⁠<#1403945676945096796>`
  }
{
      name: 'Crossplay',
    allowedChannels: [
      '1217596119098593384',
      '1450990654707470366',
      '1403945676945096796'
    ],
      // Replace with the actual channel IDs
      //Group 3: Crossplay
    triggers: [
        'join on ps5','ps5 join','join ps5','ps5 server','ps5 only','join on ps4','ps4 join','join ps4','playstation join','join on playstation',
        'join playstation','playstation4 join','playstation 4 join','playstation 5 join','crossplay','playstation crossplay','ps5 crossplay','ps4 crossplay',
        'crossplay ps5','crossplay ps4','crossplay pc','pc crossplay','gamepass crossplay','game pass crossplay','xbox gamepass crossplay','server pc only',
        'server pc only?','pc only','pc server only','is this pc only','pc exclusive','steam only server','gamepass join','join on gamepass','join with gamepass',
        'game pass join','xbox gamepass join','can gamepass join','can ps5 join','can ps4 join','can playstation join','can console join','console crossplay',
        'does ps5 work','does playstation work','ps 5 join','ps-5 join','plaustation join','playstaion join','cross play','cross-play'
    ],

    response: `We have enabled cross play on both Palworld servers so please play on your favorite device!`
  },

  {
        name: 'Pal Transfer',
    allowedChannels: [
      '1217596119098593384',
      '1450990654707470366',
      '1403945676945096796'
    ],
        // Replace with the actual channel IDs
        //Group 4: Global Pal Transfer
    triggers: [
        'pal transfer?','pal transfer','global pal transfer','global pal transfer?','transfer pals','transfer pal','pal transfer rules',
        'pal transfer policy','pal transfer policy?','pal transfer rules?','transferring pals allowed','transferring pals allowed?','can i transfer my pal',
    ],
    response: `
For Palworld PVE servers it is allowed to download and upload pals as long as they able to be obtain through normal gameplay, 
any illegal/genned pal will face disciplinary actions up to permanently being banned 

For Palwrold PVP servers it is only allowed to upload pals as the server will reset between seasons. no downloading of pals is allowed.`
  },
];
// Please copy the correct channel IDs and update the server information as needed.
// Please make sure you have developer mode enabled to get the correct channel IDs.
// Add more trigger-response pairs as needed

client.on('messageCreate', message => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();
  const channelId = message.channel.id;

  for (const group of triggerResponses) {

    //Skip if channel not allowed for this trigger group
    if (
      group.allowedChannels &&
      !group.allowedChannels.includes(channelId)
    ) continue;

    for (const trigger of group.triggers) {
      if (content.includes(trigger)) {
        message.reply(group.response);
        return;
      }
    }
  }
});

client.login(process.env.TOKEN);