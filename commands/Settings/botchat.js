const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
  name: "botchat", //the command name for execution & for helpcmd [OPTIONAL]

  category: "Settings",
  aliases: ["botch"],
  usage: "botchat <add/remove> <#Channel>",

  cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
  description: "Quản lý Bot-Chat!", //the command description for helpcmd [OPTIONAL]
  memberpermissions: ["MANAGE_GUILD "], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  run: async (client, message, args) => {
    try {
      //things u can directly access in an interaction!
      const {
        member,
      } = message;
      const {
        guild
      } = member;

      if (!args[0]) {
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.x} **Vui lòng thêm Phương pháp + Kênh!**`)
            .setDescription(`**Usage:**\n> \`${client.settings.get(message.guild.id, "prefix")}botchat <add/remove> <#Channel>\``)
          ],
        });
      }
      let add_remove = args[0].toLowerCase();
      if (!["add", "remove"].includes(add_remove)) {
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.x} **Vui lòng thêm Phương pháp + Kênh!**`)
            .setDescription(`**Usage:**\n> \`${client.settings.get(message.guild.id, "prefix")}botchat <add/remove> <#Channel>\``)
          ],
        });
      }
      let Channel = message.mentions.channels.first();
      if (!Channel) {
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.x} **Vui lòng thêm Phương pháp + Kênh!**`)
            .setDescription(`**Usage:**\n> \`${client.settings.get(message.guild.id, "prefix")}botchat <add/remove> <#Channel>\``)
          ],
        });
      }
      client.settings.ensure(guild.id, {
        botchannel: []
      });

      if (add_remove == "add") {
        if (client.settings.get(guild.id, "botchannel").includes(Channel.id)) {
          return message.reply({
            embeds: [
              new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle(`${client.allEmojis.x} **Kênh này đã là một kênh trong danh sách cho phép!**`)
            ],
          })
        }
        client.settings.push(guild.id, Channel.id, "botchannel");
        var djs = client.settings.get(guild.id, `botchannel`).map(r => `<#${r}>`);
        if (djs.length == 0) djs = "`not setup`";
        else djs.join(", ");
        return message.reply({
          embeds: [
            new MessageEmbed()
            .setColor(ee.color)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.check_mark} **Channel này \`${Channel.name}\` đã thêm vào ${client.settings.get(guild.id, "djroles").length - 1} danh sách Bot-Channels!**`)
            .addField(`🎧 **Bot-Channel${client.settings.get(guild.id, "botchannel").length > 1 ? "s": ""}:**`, `>>> ${djs}`, true)
          ],
        })
      } else {
        if (!client.settings.get(guild.id, "botchannel").includes(Channel.id)) {
          return message.reply({
            embeds: [
              new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle(`${client.allEmojis.x} **Kênh này chưa phải là một kênh trong danh sách cho phép!**`)
            ],
          })
        }
        client.settings.remove(guild.id, Channel.id, "botchannel");
        var djs = client.settings.get(guild.id, `botchannel`).map(r => `<#${r}>`);
        if (djs.length == 0) djs = "`not setup`";
        else djs.join(", ");
        return message.reply({
          embeds: [
            new MessageEmbed()
            .setColor(ee.color)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.check_mark} **Channel này \`${Channel.name}\` đã bị loại bỏ từ ${client.settings.get(guild.id, "djroles").length} danh sách Bot-Channels!**`)
            .addField(`🎧 **Bot-Channel${client.settings.get(guild.id, "botchannel").length > 1 ? "s": ""}:**`, `>>> ${djs}`, true)
          ],
        })
      }

    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  }
}
