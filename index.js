const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // - fancy way of saying server
    GatewayIntentBits.GuildMessages, // - access to member messages in a server
    GatewayIntentBits.MessageContent
  ]
});

const config = {
  prefix: "!", // - !help
  token: "<insert your token here>"
};
// neovim
client.on('ready', () => {
  console.log("the bot is ready");
})

// --> font ligatures <--
// = and > equals =>
// = = = equals ===
client.on('messageCreate', async message => {
  if (message.author.bot) return; // - skips if bot sent the message
  if (message.channel.type === "dm") return; // - disable DMs

  console.log(`${message.author} has sent: ${message.content}`)
  // - command processor
  // - !open CCPROG3 ge=false
  let messageArray = message.content.split(" "); // - ["!classes", "CCPROG3", "ge=false"]
  let cmd = messageArray[0]; // - it saves "!classes" to cmd
  let args = messageArray.slice(1); // - removes "!classes"

  if (!cmd.startsWith(config.prefix)) return;

  // - some code over here
  if (cmd === "!ping") // check if the command sent by the user is "!ping"
    message.channel.send("pong!");

  if (cmd === "!class") {

    axios.get(`https://api.berde.co/course/${args[0]}`)
      .then(response => {
        const classArray = response.data.docs;

        let classesString = "";

        classArray.forEach((element) => {
          classesString += `${element.class} | ${element.section} | ${element.schedules[0].prof}\n`;
        })

        const embed = new EmbedBuilder()
          .setTitle("Classes for CCPROG3")
          .setDescription(`Classes available for CCPROG3:\n\`${classesString}\``)
          .setColor("#1ca800");

        message.reply({ embeds: [embed] });
      })
      .catch(error => {
        console.error(error);
        console.log("errrored");
      })
  }
})

client.login(config.token);
