const {
  MessageEmbed,
  Message
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const FiltersSettings = require("../../botconfig/filters.json");
const {
  check_if_dj
} = require("../../handlers/functions")

module.exports = {
  name: "filters", //the command name for the Slash Command

  category: "Filter",
  usage: "filters",
  aliases: ["listfilter", "listfilters", "allfilters"],

  description: "List các filter hoạt động!", //the command description for Slash Command Overview
  cooldown: 5,
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  run: async (client, message, args) => {
    try {
      const {
        member,
        guildId,
        guild
      } = message;
      const {
        channel
      } = member.voice;
      try {
        let newQueue = client.distube.getQueue(guildId);
        if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return message.reply({
          embeds: [
            new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .addField("**Tất cả Filter hoạt động:**", Object.keys(FiltersSettings).map(f => `\`${f}\``).join(", ") + "\n\n**CHÚ Ý:**\n> *Tất cả các Filter bắt đầu với tùy chỉnh đều có Lệnh riêng, vui lòng sử dụng chúng để xác định số lượng tùy chỉnh bạn muốn!*")
          ],
        })
        return message.reply({
          embeds: [
            new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .addField("**Tất cả Filter hoạt động:**", Object.keys(FiltersSettings).map(f => `\`${f}\``).join(", ") + "\n\n**CHÚ Ý:**\n> *Tất cả các Filter bắt đầu với tùy chỉnh đều có Lệnh riêng, vui lòng sử dụng chúng để xác định số lượng tùy chỉnh bạn muốn!*")
            .addField("**Tất cả các Filter __hiện tại__:**", newQueue.filters.map(f => `\`${f}\``).join(", "))
          ],
        })
      } catch (e) {
        console.log(e.stack ? e.stack : e)
        message.reply({
          content: `${client.allEmojis.x} | Error: `,
          embeds: [
            new MessageEmbed().setColor(ee.wrongcolor)
            .setDescription(`\`\`\`${e}\`\`\``)
          ],

        })
      }
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  }
}
