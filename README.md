# Discord ready Check Bot

Invitation-Link: https://discord.com/api/oauth2/authorize?client_id=753270895560359967&permissions=207936&scope=bot

**Commands:**  

**!Ready Start | !RC Start** - Starts a new ready check  
**!Ready Who | !RC Who** - Shows who is ready  

**Latest change:**  
• Fix: The bot now fetches old messages even after reconnecting so that reactions are recognized  
• Fix: User-Count after a react now works as it should be  
• Change: **!RC Who**-command only sends one message instead of three and is better formatted  

**Notes**  
• **!Ready Who** only works if the origin check is within the **latest 50 messages!**  
• If the channel-category matches a server-role, users automatically get mentioned by the bot.  

**Bugs**  
• Users are able to select multiple states.  
• The bot won't write a "confirm"-message when a user reacts too quick while the bot is adding the reactions  
• Don't write "*Starting a ready check for*". Just don't. Much Error.  

*Current Version: 1.1.3 (28/09/2020)* 