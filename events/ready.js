const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const config = require("../config.json");
const { Client, GatewayIntentBits, Partials, ActivityType } = require("discord.js");
const INTENTS = Object.values(GatewayIntentBits);
const PARTIALS = Object.values(Partials);
const chalk = require("chalk");
const db = require("croxydb");

const client = new Client({
  intents: INTENTS,
  allowedMentions: {
    parse: ["users"]
  },
  partials: PARTIALS,
  retryLimit: 3
});

module.exports = async (client) => {

  const rest = new REST({ version: "10" }).setToken(config.token);
  try {
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: client.commands,
    });
  } catch (error) {
    console.error(error);
  }
  
  console.log(chalk.green`[START]` + ` ${client.user.tag} bot aktif!`);

  const links = db.get("uptimelink");

  client.user.setPresence({
    activities: [{ name: `${links.length || "0"} tane link`, type: ActivityType.Watching }],
    status: 'idle',
  });
  
  setInterval(() => {
    client.user.setPresence({
      activities: [{ name: `${links.length || "0"} tane link`, type: ActivityType.Watching }],
      status: 'idle',
    });
  }, 120000)
};
