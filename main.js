///Lets load everything up!
"use strict";
const Discord = require('discord.js');
const bot = new Discord.Client();
const child_process = require("child_process");
const config = require('./config.json');
const version = "V1.5.0"

//Now for the code!
bot.on('ready', () => {
    delete bot.user.email;
    delete bot.user.verified;
    console.log(`Here we go! Logged in as ${bot.user}. I am on ${bot.guilds.size} servers!`);
});

//Removes all @everyones from the text inputted when called.
function clean(text) {
    if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
};



bot.on('message', (message) => {
    let args = message.content.split(" ").slice(1);

    if (message.author.id === bot.user.id) {

        if (message.content == config.prefix + 'test') {
            message.channel.sendMessage("", {
                embed: {
                    title: "Test message",
                    color: 0x06DF00,
                    description: "Hey!",
                    footer: {
                        text: "Message by Daniel-Selfbot. " + version
                    }
                }
            });
        }

        if (message.content.startsWith(config.prefix + "eval")) {
            try {
                var code = args.join(" ");
                var evaled = eval(code);

                if (typeof evaled !== "string")
                    evaled = require("util").inspect(evaled);

                message.channel.sendCode("xl", clean(evaled));
            } catch (err) {
                message.channel.sendMessage(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
            }
        }
        if (message.content.startsWith(config.prefix + "purge")) {
        if(args.length == 0) {
          message.channel.sendMessage("", {embed: {
            title: "Error:",
            color: 0xff0000,
            description: " :x: You did not specify an amount to delete :x: ",
            footer: {
              text: "Message by Daniel-Selfbot. " + version
            }
          }});
        } else {
          let count = 0, delete_array = [];
          if(args.length == 0) {
            count = 2;
          } else {
            count = parseInt(args[0]) + 1;
          }
          message.channel.fetchMessages({limit: count}).then(messages => {
            delete_array = messages.filter(msg => msg.author.id == bot.user.id);
            delete_array.map(msg => msg.delete().catch(console.error));
            console.log("Messages purged");
          }).catch(console.error);
        }
    }
        if (message.content.startsWith(config.prefix + "info")) {
        let usr;
        if(args.length == 0) {
          usr = message.author;
  } else if(message.mentions.users.size == 0) {
      message.channel.sendMessage("`You must mention someone.`");
  } else {
      usr = message.mentions.users.first();
  }
  if(usr != undefined) {
    message.channel.sendMessage("", {embed: {
      title: "User info: " + usr.username,
      color: 0x06DF00,
      description: `Username: ${usr.username}#${usr.discriminator} \n Joined discord: ${usr.createdAt} \n `,
      thumbnail: {
        height: 200,
        width:  200,
        url: usr.avatarURL
      },
      footer: {
        text: "Message by Daniel-Selfbot. " + version
      }
    }});
  };
}
            if (message.content == config.prefix + 'update'){
                console.info("Now checking for updates.");
                message.edit(" :arrows_counterclockwise: Now checking for updates :arrows_counterclockwise: ");
                console.info("Pulling from Github");
                message.edit(" :arrows_counterclockwise: Pulling from GitHub :arrows_counterclockwise: ");
                child_process.execSync('git pull git://github.com/danielgraycode/Selfbot.git').catch(console.error);
                message.edit("√ Bot updated: Nodemon will restart the bot if needed. √").then(m => m.delete(1500));
                console.info("Update complete.")
            }
        if (message.content.startsWith(config.prefix + "warn")) {
        let warnedUser = message.mentions.users.first();
        message.channel.sendMessage("", {
            embed: {
                title: "Warning!",
                color: 0xffcc00,
                description: `<@${warnedUser.id}>, ${message.author} has given you a warning. This usually means you did something bad! \n Watch out in the future.`,
                footer: {
                    text: "Message by Daniel-Selfbot. " + version
                }
            }
        });
        }
        if (message.content.startsWith(config.prefix + "embed")) {
          let messagetoembed = args.join(" ");
          message.delete()
          message.channel.sendMessage("", {
              embed: {
                  title: `Daniel | danielgray.me`,
                  description: " " + messagetoembed,
                  thumbnail: {
                    width: 200,
                    height: 200,
                    url: bot.user.avatarURL
                  },
                  footer: {
                      text: "Message by Daniel-Selfbot. " + version
                  }
              }
          });
        }
        if (message.content == config.prefix + "commands") {
          message.channel.sendMessage("", {
              embed: {
                  title: `Daniel | danielgray.me`,
                  color: 0x06DF00,
                  description: "The commands are: `test , eval , purge , info , shutdown , warn , setgame .`",
                  footer: {
                      text: "Message by Daniel-Selfbot. " + version
                  }
              }
          });
        }
        if (message.content == config.prefix + "setgame") {
          let newgame = args.join(" ");
          bot.setGame(newgame).catch(console.error);
          message.channel.sendMessage("", {
              embed: {
                  title: `Status`,
                  color: 0x06DF00,
                  description: "Status updated!",
                  footer: {
                      text: "Message by Daniel-Selfbot. " + version
                  }
              }
          });
        }
    }
});

bot.login(config.botToken);

