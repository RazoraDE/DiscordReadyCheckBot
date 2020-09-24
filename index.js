// npm install nodemon --save-dev
// npm run dev

require("dotenv").config()

const Discord = require("discord.js")
const client = new Discord.Client()

var botId = "753270895560359967";

var arrayAccept = []
var arrayDenied = []
var arrayNotSure = []

var arrayAcceptMsg = ["joined the party!", "joined the squad!", "saved the day!", "wants to spend the evening with awesome people!"]
var arrayDeniedMsg = ["seems to have cooler friends.", "is not in the mood for the group.", "must have better things to do.", "doesn't have time for that bs."]
var arrayNotSureMsg = ["can't decide right now.", "isn't sure yet.", "has to think twice about it."]

client.on("ready", () =>{
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
      status: "online",  //You can show online, idle....
      activity: {
          name: "!Ready ? for help",  //The message shown
          type: "PLAYING" //PLAYING: WATCHING: LISTENING: STREAMING:
      }
  });
});


// ON GET MESSAGE
client.on("message", (msg) => 
{
  const channelCategory = msg.channel.parent.name

    // Shows commands for the bot
    if(msg.content.toLowerCase() === "!Ready ?".toLowerCase() || msg.content.toLowerCase() === "!Ready Help".toLowerCase())
    {
      HelpCommand(msg)
    }

    // Starts a ready check
    if (msg.content.toLowerCase() === "!Ready Start".toLowerCase() || msg.content.toLowerCase() === "!RC Start".toLowerCase()) 
    {
      ResetValues()
      var role = msg.member.roles.cache.find(r => r.name === channelCategory)
      if(role)
      {
        msg.channel.send(`Starting a ready check for ${role}`);
      }
      else
      {
        msg.channel.send(`Starting a ready check`);
      }
    }

    // Shows current states of people who reacted
    if (msg.content.toLowerCase() === "!Ready Who".toLowerCase() || msg.content.toLowerCase() === "!RC Who".toLowerCase() ) 
    {
      ResetValues();

      GetReactionsFromLastCheck(msg).then(value => {
        PrintWhosReady(msg);
      });
    }

    // Adds reactions to current ready check
    if(msg.content.startsWith("Starting a ready check") && msg.author.id === botId)
    {
      AddReactionsToreadyCheck(msg);
    }
})

// ON GET MESSAGE REACT ADD
client.on('messageReactionAdd', (reaction, user) => 
{
  ResetValues();
  GetReactionsFromLastCheck(reaction.message).then(value => {
    AddUser(reaction, user);
  });
})

// ON GET MESSAGE REACT REMOVE
client.on('messageReactionRemove', (reaction, user) => 
{
  ResetValues();
  GetReactionsFromLastCheck(reaction.message).then(value => {
    RemoveUser(reaction, user);
  });
})

client.login(process.env.BOT_TOKEN)




function ResetValues()
{
  arrayAccept = []
  arrayDenied = []
  arrayNotSure = []
}

function GetReactionsFromLastCheck(msg)
{
  return new Promise((resolve, reject)  =>
    {
    msg.channel.messages.fetch().then((messages) => 
    {
      var acMessage = messages.array().filter(m => m.content.startsWith("Starting a ready check"))[0];
      if(acMessage.author.id === botId)
      {
        var reactionAccept = acMessage.reactions.cache.find(r => r.emoji.name === '✅');
        var reactionDenied = acMessage.reactions.cache.find(r => r.emoji.name === '❌');
        var reactionNotSure = acMessage.reactions.cache.find(r => r.emoji.name === '❔');
        if(reactionAccept)
        {
          reactionAccept.users.fetch().then((userArray) =>
          {
            userArray.filter(u => !u.bot).forEach(name => {
              arrayAccept.push(name.username)
            });
          })
        }
        if(reactionDenied)
        {
          reactionDenied.users.fetch().then((userArray) =>
          {
            userArray.filter(u => !u.bot).forEach(name => {
              arrayDenied.push(name.username)
            });
          })
        }
        if(reactionNotSure)
        {
          reactionNotSure.users.fetch().then((userArray) =>
          {
            userArray.filter(u => !u.bot).forEach(name => {
              arrayNotSure.push(name.username)

            });
            console.log("Resolved")
            resolve()
          })
        }
      }
      else{
        reject()
      }
    });
  });
}

function PrintWhosReady(msg)
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

function AddUser(reaction, user)
{
  if(reaction.emoji.name === "✅")
  {
    if(user.id !== botId)
    {
      arrayAccept.push(user.username)
      reaction.message.channel.send(`✅ ${user.username} ${arrayAcceptMsg[Math.floor(Math.random() * arrayAcceptMsg.length)]} [${arrayAccept.length}]`)
    }
  }
  else if(reaction.emoji.name === "❌") 
  {
    if(user.id !== botId)
    {
      arrayDenied.push(user.username)
      reaction.message.channel.send(`❌ ${user.username} ${arrayDeniedMsg[Math.floor(Math.random() * arrayDeniedMsg.length)]} [${arrayDenied.length}]`)
    }
  }
  else if(reaction.emoji.name === "❔") 
  {
    if(user.id !== botId)
    {
      arrayNotSure.push(user.username)
      reaction.message.channel.send(`❔ ${user.username} ${arrayNotSureMsg[Math.floor(Math.random() * arrayNotSureMsg.length)]} [${arrayNotSure.length}]`)
    }
  }
}

function RemoveUser(reaction)
{
  if(reaction.emoji.name === "✅") 
  {
    arrayAccept = arrayAccept.filter(e => e !== user.username)
    reaction.message.channel.send(`❌ ${user.username} left the party! [${arrayAccept.length}]`)
  }
  else if(reaction.emoji.name === "❌") 
  {
    arrayDenied = arrayDenied.filter(e => e !== user.username)
  }
  else if(reaction.emoji.name === "❔") 
  {
    arrayNotSure = arrayNotSure.filter(e => e !== user.username)
  }
}

function AddReactionsToreadyCheck(msg)
{
  msg.react('✅');
  msg.react('❌');
  msg.react('❔');
}

function HelpCommand(msg)
{
  msg.channel.send("**################## Ready Check ##################**\n" +
  "\n" +
  "__**Commands (non case sensitive):**__\n" +
  "**!Ready Start | !RC Start** \t Starts a new ready check\n" +
  "**!Ready Who | !RC Who** \t Shows who is ready\n" +
  "\n" +
  "__**Latest change:**__\n" +
  "• A ready check can now get called in multiple channels\n" +
  "• Added customized messages for state pick\n" +
  "\n" +
  "__**Notes**__\n" +
  "*• !Ready Who only works if the origin check is within the latest 50 messages!*\n" +
  "*• If the channel-category matches a server-role, users automatically get mentioned by the bot*\n" +
  "\n" +
  "__**Bugs**__\n" +
  "• Users are able to select multiple states\n" +
  "• Don't write \"*Starting a ready check*\". Just don't. Much Error.\n" +
  "\n" +
  "*Current Version: 1.1.1 (23/09/2020)*\n" +
  "*Developed by Razora*\n" +
  "*Source Code: https://github.com/RazoraDE/DiscordReadyCheckBot*\n" +
  "\n" +
  "**################################################**");
}