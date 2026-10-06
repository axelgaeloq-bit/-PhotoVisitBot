const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
const PORT = process.env.PORT || 3000;

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

app.get("/", (req, res) => {
  res.send("🟢 PhotoVisitBot está funcionando.");
});

app.listen(PORT, () => {
  console.log(`Servidor web funcionando en el puerto ${PORT}`);
});

client.once("ready", async () => {
  console.log(`Bot conectado como ${client.user.tag}`);

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);

    if (channel) {
      await channel.send("🟢 Bot conectado correctamente.");
    }
  } catch (error) {
    console.error("No pude acceder al canal:", error);
  }
});

client.login(TOKEN);
