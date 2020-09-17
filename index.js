// npm install nodemon --save-dev
// npm run dev

require("dotenv").config()

const Discord = require("discord.js")
const client = new Discord.Client()

lastMessage = new Discord.Message;
var arrayAccept = [];
var arrayDenied = [];
var arrayNotSure = [];

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
  const channelCategory = msg.channel.parent.name

  // Shows commands for the bot
  
    if(msg.content.toLowerCase() === "!AC ?".toLowerCase())
    {
      msg.channel.send("**!AC Start** \t Starts a new available check");
      msg.channel.send("**!AC Who** \t Shows who is available");
    }

    // Starts an available check
    if (msg.content.toLowerCase() === "!AC Start".toLowerCase()) 
    {
      if(msg.channel.name !== "ready-check")
      {
        msg.channel.send("Wrong channel to start a check!")
      }
      else
      {
        msg.channel.bulkDelete(100)

        arrayAccept = []
        arrayDenied = []
        arrayNotSure = []
        counterAccept = 0
        counterDenied = 0
        counterNotSure = 0

        var role = msg.member.roles.cache.find(r => r.name === channelCategory)

        msg.channel.send(`Starting an available check for ${role}`);
      }
    }

    // Shows current states of people who reacted
    if (msg.content.toLowerCase() === "!AC Who".toLowerCase()) 
    {
      if(arrayAccept.length > 0)
      {
        if(arrayAccept.length === 1)
          msg.channel.send(`${arrayAccept.length} person is ready for some awesome games: ${arrayAccept}`)
        else
          msg.channel.send(`${arrayAccept.length} people are ready for some awesome games: ${arrayAccept}`)
      }
      if(arrayDenied.length > 0)
      {
        if(arrayDenied.length === 1)
          msg.channel.send(`${arrayDenied.length} person hates having fun: ${arrayDenied}`)
        else
          msg.channel.send(`${arrayDenied.length} people hate having fun: ${arrayDenied}`)
      }
      if(arrayNotSure.length > 0)
      {
        if(arrayNotSure.length === 1)
          msg.channel.send(`${arrayNotSure.length} person has to rethink their live: ${arrayNotSure}`)
        else
          msg.channel.send(`${arrayNotSure.length} people have to rethink their lives: ${arrayNotSure}`)
      }

      if(arrayAccept.length === 0)
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
      arrayAccept.push(user.username)
      reaction.message.channel.send(`${user.username} joined the party! [${arrayAccept.length}]`)
    }
  }
  else if(reaction.emoji.name === "❌") 
  {
    if(user.username !== "AvailableCheck")
    {
      arrayDenied.push(user.username)
      reaction.message.channel.send(`${user.username} doesn't have time for this bs. [${arrayDenied.length}]`)
    }
  }
  else if(reaction.emoji.name === "❔") 
  {
    if(user.username !== "AvailableCheck")
    {
      arrayNotSure.push(user.username)
      reaction.message.channel.send(`${user.username} isn't sure yet. [${arrayNotSure.length}]`)
    }
  }
})


// ON GET MESSAGE REACT REMOVE
client.on('messageReactionRemove', (reaction, user) => 
{
  if(reaction.emoji.name === "✅") 
  {
    arrayAccept = arrayAccept.filter(e => e !== user.username)
    reaction.message.channel.send(`${user.username} left the party! [${arrayAccept.length}]`)
  }
  else if(reaction.emoji.name === "❌") 
  {
    arrayDenied = arrayDenied.filter(e => e !== user.username)
  }
  else if(reaction.emoji.name === "❔") 
  {
    arrayNotSure = arrayNotSure.filter(e => e !== user.username)
  }
})

client.login(process.env.BOT_TOKEN)