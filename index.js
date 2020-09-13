const Discord = require("discord.js")
const client = new Discord.Client()
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})
client.on("message", (msg) => {
  if (msg.content === "ping") {
    msg.reply("Pong!")
  }
})
client.login("NzUzMjcwODk1NTYwMzU5OTY3.X1jwMA.cKKi48NvTOeXSAQUG2nNc0NAK6w")