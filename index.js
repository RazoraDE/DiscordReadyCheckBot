// npm install nodemon --save-dev
// npm run dev

require("dotenv").config()

const Discord = require("discord.js")
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

var botId = "753270895560359967";
var botIdDevelopment = "760180386499657744";

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
          name: "!RC ? for help",  //The message shown
          type: "PLAYING" //PLAYING: WATCHING: LISTENING: STREAMING:
      }
  });
});


// ON GET MESSAGE
client.on("message", (msg) => 
{
  const channelCategory = msg.channel.parent.name

    // Shows commands for the bot
    if(msg.content.toLowerCase() === "!Ready ?".toLowerCase() || 
      msg.content.toLowerCase() === "!Ready Help".toLowerCase() || 
      msg.content.toLowerCase() === "!RC Help".toLowerCase() || 
      msg.content.toLowerCase() === "!RC ?".toLowerCase())
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
      ResetValues().then(value => {
        GetReactionsFromLastCheck(msg).then(value => {
          PrintWhosReady(msg);
        });
      })
    }

    // Adds reactions to current ready check
    if(msg.content.startsWith("Starting a ready check") && (msg.author.id === botId || msg.author.id === botIdDevelopment))
    {
      AddReactionsToreadyCheck(msg);
    }
})

// ON GET MESSAGE REACT ADD
client.on('messageReactionAdd', (reaction, user) => 
{
  ResetValues().then(value => {
    GetReactionsFromLastCheck(reaction.message).then(value => {
      AddUser(reaction, user);
    });
  })
})

// ON GET MESSAGE REACT REMOVE
client.on('messageReactionRemove', (reaction, user) => 
{
  ResetValues().then(value => {
    GetReactionsFromLastCheck(reaction.message).then(value => {
      RemoveUser(reaction, user);
    });
  })
})

client.login(process.env.BOT_TOKEN)



function ResetValues()
{
  return new Promise((resolve, reject)  => {
    arrayAccept = []
    arrayDenied = []
    arrayNotSure = []
    resolve();
  });
}

function GetReactionsFromLastCheck(msg)
{
  return new Promise((resolve, reject)  =>
    {
    msg.channel.messages.fetch().then((messages) => 
    {
      var acMessage = messages.array().filter(m => m.content.startsWith("Starting a ready check"))[0];
      if(acMessage.author.id === botId || acMessage.author.id === botIdDevelopment)
      {
        var reactionAccept = acMessage.reactions.cache.find(r => r.emoji.name === '✅');
        var reactionDenied = acMessage.reactions.cache.find(r => r.emoji.name === '❌');
        var reactionNotSure = acMessage.reactions.cache.find(r => r.emoji.name === '❔');
        if(reactionAccept)
        {
          reactionAccept.users.fetch().then((userArray) =>
          {
            userArray.filter(u => !u.bot).forEach(name => {
              if(!arrayAccept.includes(name.username)){
                arrayAccept.push(name.username)
              }
            });
          })
        }
        if(reactionDenied)
        {
          reactionDenied.users.fetch().then((userArray) =>
          {
            userArray.filter(u => !u.bot).forEach(name => {
              if(!arrayDenied.includes(name.username)){
                arrayDenied.push(name.username)
              }
            });
          })
        }
        if(reactionNotSure)
        {
          reactionNotSure.users.fetch().then((userArray) =>
          {
            userArray.filter(u => !u.bot).forEach(name => {
              if(!arrayNotSure.includes(name.username)){
                arrayNotSure.push(name.username)
              }
            });
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
  var arrayOutput = [];

  if(arrayAccept.length > 0)
  {
    if(arrayAccept.length === 1)
      arrayOutput.push(`✅ ${arrayAccept.length} person is ready for some awesome games \n**${arrayAccept}**\n`)
    else
      arrayOutput.push(`✅ ${arrayAccept.length} people are ready for some awesome games \n**${arrayAccept.join(", ")}**\n`)
  }

  if(arrayDenied.length > 0)
  {
    if(arrayDenied.length === 1)
      arrayOutput.push(`❌ ${arrayDenied.length} person hates having fun \n~~${arrayDenied}~~\n`)
    else
      arrayOutput.push(`❌ ${arrayDenied.length} people hate having fun \n~~${arrayDenied.join(", ")}~~\n`)
  }

  if(arrayNotSure.length > 0)
  {
    if(arrayNotSure.length === 1)
      arrayOutput.push(`❔ ${arrayNotSure.length} person has to rethink their live \n*${arrayNotSure}*\n`)
    else
      arrayOutput.push(`❔ ${arrayNotSure.length} people have to rethink their lives \n*${arrayNotSure.join(", ")}*\n`)
  } 

  if(arrayAccept.length === 0)
  {
      arrayOutput.push("Nobody wants to play with u.")
  }

  msg.channel.send(arrayOutput.join('\n'));
}

function AddUser(reaction, user)
{
  if(!user.bot)
  {
    if(reaction.emoji.name === "✅")
    {
        console.log(user.username + " joined")
        reaction.message.channel.send(`✅ ${user.username} ${arrayAcceptMsg[Math.floor(Math.random() * arrayAcceptMsg.length)]} [${arrayAccept.length}]`)
    }
    else if(reaction.emoji.name === "❌") 
    {
        console.log(user.username + " declined")
        reaction.message.channel.send(`❌ ${user.username} ${arrayDeniedMsg[Math.floor(Math.random() * arrayDeniedMsg.length)]} [${arrayDenied.length}]`)
    }
    else if(reaction.emoji.name === "❔") 
    {
        console.log(user.username + " not sure")
        reaction.message.channel.send(`❔ ${user.username} ${arrayNotSureMsg[Math.floor(Math.random() * arrayNotSureMsg.length)]} [${arrayNotSure.length}]`)
    }
  }
}

function RemoveUser(reaction, user)
{
  if(reaction.emoji.name === "✅") 
  {
    //arrayAccept = arrayAccept.filter(e => e !== user.username)
    reaction.message.channel.send(`❌ ${user.username} left the party! [${arrayAccept.length}]`)
  }
  else if(reaction.emoji.name === "❌") 
  {
    //arrayDenied = arrayDenied.filter(e => e !== user.username)
  }
  else if(reaction.emoji.name === "❔") 
  {
    //arrayNotSure = arrayNotSure.filter(e => e !== user.username)
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
  "• Fix: The bot now fetches old messages even after reconnecting so that reactions are recognized\n" +
  "• Fix: User-Count after a react now works as it should be\n" +
  "• Change: \"!RC Who\"-command only sends one message instead of three and is better formatted\n" +
  "\n" +
  "__**Notes**__\n" +
  "*• !Ready Who only works if the origin check is within the latest 50 messages!*\n" +
  "*• If the channel-category matches a server-role, users automatically get mentioned by the bot*\n" +
  "\n" +
  "__**Bugs**__\n" +
  "• Users are able to select multiple states\n" +
  "• The bot won't write a \"confirm\"-message when a user reacts too quick while the bot is adding the reactions\n" +
  "• Don't write \"*Starting a ready check*\". Just don't. Much Error.\n" +
  "\n" +
  "*Current Version: 1.1.3 (28/09/2020)*\n" +
  "*Developed by Razora*\n" +
  "*Source Code: https://github.com/RazoraDE/DiscordReadyCheckBot*\n" +
  "\n" +
  "**#############################################**");
}