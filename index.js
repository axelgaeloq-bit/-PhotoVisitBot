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
  const clientId = process.env.DISCORD_CLIENT_ID;

  const discordLogin =
    `https://discord.com/oauth2/authorize?client_id=${clientId}` +
    `&response_type=code&redirect_uri=${encodeURIComponent(
      "https://photovisitbot-1.onrender.com/callback"
    )}` +
    `&scope=identify`;

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>PhotoVisitBot</title>
    </head>
    <body style="font-family:Arial;text-align:center;padding:40px">
      <h1>🖼️ Foto</h1>

      <p>Esta página registra las visitas.</p>
      <p>Para continuar, inicia sesión voluntariamente con Discord.</p>

      <a href="${discordLogin}"
         style="display:inline-block;padding:15px 25px;
         background:#5865F2;color:white;text-decoration:none;
         border-radius:8px;">
         Continuar con Discord
      </a>
    </body>
    </html>
  `);
});

app.get("/callback", async (req, res) => {
  try {
    const code = req.query.code;

    if (!code) {
      return res.status(400).send("Falta el código de Discord.");
    }

    const params = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: "https://photovisitbot-1.onrender.com/callback"
    });

    const tokenResponse = await fetch(
      "https://discord.com/api/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return res.status(400).send("No se pudo iniciar sesión con Discord.");
    }

    const userResponse = await fetch(
      "https://discord.com/api/users/@me",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`
        }
      }
    );

    const user = await userResponse.json();

    const channel = await client.channels.fetch(CHANNEL_ID);

    await channel.send(
      `📸 **Nueva visita**\n` +
      `👤 Discord: **${user.username}**\n` +
      `🕒 Hora: <t:${Math.floor(Date.now() / 1000)}:F>`
    );

    res.send(`
      <h1>✅ Listo</h1>
      <p>Tu visita fue registrada correctamente.</p>
    `);

  } catch (error) {
    console.error(error);
    res.status(500).send("Ocurrió un error.");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});

client.once("ready", () => {
  console.log(`Bot conectado como ${client.user.tag}`);
});

client.login(TOKEN);
