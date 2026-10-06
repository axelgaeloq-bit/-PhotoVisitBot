const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

client.once("ready", () => {
  console.log(`Bot conectado como ${client.user.tag}`);

  const channel = client.channels.cache.get(CHANNEL_ID);

  if (channel) {
    channel.send("🟢 Bot conectado correctamente.");
  }
});

client.login(TOKEN);
