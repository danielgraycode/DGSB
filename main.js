///Lets load everything up!
"use strict";
const Discord = require('discord.js');
//Essential to update:
const updater = require("./update.js")
const bot = new Discord.Client();
const config = require('./config.json');
const version = "v1.3.0"

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
}

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
                        text: "Message by DGSB. " + version
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
              text: "Message by DGSB. " + version
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
        text: "Message by DGSB. " + version
      }
    }});
  };
}
        if (message.content == config.prefix + "shutdown") {
            message.edit(" :arrows_counterclockwise: Shutting Down! :arrows_counterclockwise: ").then(message => {
                setTimeout(() => {
                    message.delete().then(() => process.exit(1));
                }, 500);
            });
        };
        if (message.content.startsWith(config.prefix + "warn")) {
        let warnedUser = message.mentions.users.first();
        message.channel.sendMessage("", {
            embed: {
                title: "Warning!",
                color: 0xffcc00,
                description: `<@${warnedUser.id}>, ${message.author} has given you a warning. This usually means you did something bad! \n Watch out in the future.`,
                footer: {
                    text: "Message by DGSB. " + version
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
                      text: "Message by DGSB. " + version
                  }
              }
          });
        }
        if (message.content == config.prefix + "commands") {
          message.channel.sendMessage("", {
              embed: {
                  title: `Daniel | danielgray.me`,
                  color: 0x06DF00,
                  description: "The commands are: `test , eval , purge , info , shutdown , warn , setgame , contact .`",
                  footer: {
                      text: "Message by DGSB. " + version
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
                      text: "Message by DGSB. " + version
                  }
              }
          });
        }


        if (message.content == config.prefix + "contact") {
          message.delete();
          message.channel.sendMessage("", {
              embed: {
                  title: `Contact info`,
                  color: 0x06DF00,
                  description: "**Website:** \n https://danielgray.me \n **GitHub:** \n https://github.com/danielgraycode \n **Keybase:** \n https://keybase.io/danielgray_ ",
                  footer: {
                      text: "Message by DGSB. " + version
                  }
              }
          });
        }

        if (message.content == config.prefix + "credits") {
          message.delete();
          message.channel.sendMessage("", {
              embed: {
                  title: `Credits`,
                  color: 0x06DF00,
                  description: "Credits to the original maker and developer of DGSB, Daniel Gray. He can be found at https://github.com/danielgraycode or https://danielgray.me",
                  footer: {
                      text: "Message by DGSB. " + version
                  }
              }
          });
        }
        if (message.content == config.prefix + "update") {
          message.edit(" :arrows_counterclockwise: Now updating! :arrows_counterclockwise: ");
          updater.runUpdate()

        }
    }
});

bot.login(config.botToken);
