const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
  name: "defaultvolume", //the command name for execution & for helpcmd [OPTIONAL]
  category: "Settings",
  aliases: ["dvolume"],
  usage: "defaultvolume <Percentage>",
  cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
  description: "Xác định âm lượng mặc định của Bot!", //the command description for helpcmd [OPTIONAL]
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
          embeds: [
            new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.x} **Vui lòng thêm một âm lượng!**`)
            .setDescription(`**Usage:**\n> \`${client.settings.get(guild.id, "prefix")}defaultvolume <percentage>\``)
          ],
        })
      }
      let volume = Number(args[0]);
      client.settings.ensure(guild.id, {
        defaultvolume: 50
      });

      if (!volume || (volume > 150 || volume < 1)) {
        return message.reply({
          embeds: [
            new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.x} **Âm lượng __phải__ từ \`1\` đến \`150\`!**`)
          ],
        })
      }
      client.settings.set(guild.id, volume, "defaultvolume");
      return message.reply({
        embeds: [
          new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`${client.allEmojis.check_mark} **Âm lượng mặc định được đặt thành: \`${volume}\`!**`)
        ],
      })
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  }
}
