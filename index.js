require("dotenv").config()

const Discord = require("discord.js")
const client = new Discord.Client()

lastMessage = new Discord.Message;
var counter = 0;
var playerArray = [];

client.on("ready", () =>{
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
      status: "online",  //You can show online, idle....
      activity: {
          name: "!AC ? for help",  //The message shown
          type: "PLAYING" //PLAYING: WATCHING: LISTENING: STREAMING:
      }
  });
});


// ON GET MESSAGE
client.on("message", (msg) => 
{
  // Shows commands for the bot
  if(msg.content.toLowerCase() === "!AC ?".toLowerCase())
  {
    msg.channel.send("**!AC Start** \t Starts a new available check");
    msg.channel.send("**!AC Who** \t Shows who is available");
  }

  // Starts an available check
  if (msg.content.toLowerCase() === "!AC Start".toLowerCase()) 
  {
    playerArray = []
    counter = 0

    const channelCategory = msg.channel.parent.name

    msg.channel.send("Starting an available check for @" + channelCategory);
  }

  // Shows current states of people who reacted
  if (msg.content.toLowerCase() === "!AC Who".toLowerCase()) 
  {
    if(playerArray.length > 0)
    {
      msg.channel.send("Ready for some awesome games: " + playerArray)
    }
    else
    {
      msg.channel.send("Nobody wants to play with u.")
    }
  }

  // Adds reactions to current available check
  if(msg.content.startsWith("Starting an available check for"))
  {
    msg.react('✅')
    msg.react('❌')
    msg.react('❔')

    lastMessage = msg;
  }
})


// ON GET MESSAGE REACT ADD
client.on('messageReactionAdd', (reaction, user) => 
{
  if(reaction.emoji.name === "✅")
  {
    if(user.username !== "AvailableCheck")
    {
      counter++
      reaction.message.channel.send(`${user.username} joined the party! [${counter}]`)
      playerArray.push(user.username)
    }
  }
  else if(reaction.emoji.name === "❌") 
  {
    if(user.username !== "AvailableCheck")
    {
      reaction.message.channel.send(`${user.username} doesn't have time for this bs.`)
    }
  }
  else if(reaction.emoji.name === "❔") 
  {
    if(user.username !== "AvailableCheck")
    {
      reaction.message.channel.send(`${user.username} isn't sure yet.`)
    }
  }
})


// ON GET MESSAGE REACT REMOVE
client.on('messageReactionRemove', (reaction, user) => 
{
  if(reaction.emoji.name === "✅") 
  {
    counter--
    reaction.message.channel.send(`${user.username} left the party! [${counter}]`)
    playerArray = playerArray.filter(e => e !== user.username)
  }
  else if(reaction.emoji.name === "❌") 
  {
  }
  else if(reaction.emoji.name === "❔") 
  {
  }
})


client.login(process.env.BOT_TOKEN)