const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
  name: "defaultautoplay", //the command name for execution & for helpcmd [OPTIONAL]

  category: "Settings",
  aliases: ["dautoplay"],
  usage: "defaultautoplay",

  cooldown: 10, //the command cooldown for execution & for helpcmd [OPTIONAL]
  description: "Xác định xem có nên bật Tự động phát theo mặc định hay không!", //the command description for helpcmd [OPTIONAL]
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
      client.settings.ensure(guild.id, {
        defaultvolume: 50,
        defaultautoplay: false,
        defaultfilters: [`bassboost6`, `clear`]
      });

      client.settings.set(guild.id, !client.settings.get(guild.id, "defaultautoplay"), "defaultautoplay");
      return message.reply({
        embeds: [
          new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`${client.allEmojis.check_mark} **Autoplay mặc định đã __\`${client.settings.get(guild.id, "defaultautoplay") ? "Bật" : "Tắt"}\`__!**`)
        ],
      })
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  }
}
