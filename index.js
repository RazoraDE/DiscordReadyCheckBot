require("dotenv").config()

const Discord = require("discord.js")
const client = new Discord.Client()
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})
client.on("message", (msg) => {
  if (msg.content === "!AC") {
    msg.reply("Starting an Available Check for GAME")
  }
})
client.login(process.env.BOT_TOKEN)