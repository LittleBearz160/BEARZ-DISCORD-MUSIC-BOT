const {
	MessageEmbed,
	Message
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const {
	check_if_dj
} = require("../../handlers/functions")
module.exports = {
	name: "nowplaying", //the command name for the Slash Command
	category: "Song",
	usage: "nowplaying",
	aliases: ["np", "current"],
	description: "Hiển thị bài hát đang phát", //the command description for Slash Command Overview
	cooldown: 5,
	requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
	alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
	run: async (client, message, args) => {
		try {
			//things u can directly access in an interaction!
			const {
				member,
				channelId,
				guildId,
				applicationId,
				commandName,
				deferred,
				replied,
				ephemeral,
				options,
				id,
				createdTimestamp
			} = message;
			const {
				guild
			} = member;
			const {
				channel
			} = member.voice;
			if (!channel) return message.reply({
				embeds: [
					new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **Hãy join ${guild.me.voice.channel ? "__VoiceChannel__": "VoiceChannel" } trước!**`)
				],

			})
			if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
				return message.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter(ee.footertext, ee.footericon)
						.setTitle(`${client.allEmojis.x} Hãy join kênh voice chứa __tôi__!`)
						.setDescription(`<#${guild.me.voice.channel.id}>`)
					],
				});
			}
			try {
				let newQueue = client.distube.getQueue(guildId);
				if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return message.reply({
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **Hiện không có gì đang phát!**`)
					],

				})
				let newTrack = newQueue.songs[0];
				message.reply({
					content: `${client.settings.get(guild.id, "prefix")}play ${newTrack.url}`,
					embeds: [
						new MessageEmbed().setColor(ee.color)
						.setTitle(newTrack.name)
						.setURL(newTrack.url)
						.addField(`💡 Yêu cầu của:`, `>>> ${newTrack.user}`, true)
						.addField(`⏱ Thời lượng:`, `>>> \`${newQueue.formattedCurrentTime} / ${newTrack.formattedDuration}\``, true)
						.addField(`🌀 List:`, `>>> \`${newQueue.songs.length} bài hát\`\n\`${newQueue.formattedDuration}\``, true)
						.addField(`🔊 Âm lượng:`, `>>> \`${newQueue.volume} %\``, true)
						.addField(`♾ Lặp:`, `>>> ${newQueue.repeatMode ? newQueue.repeatMode === 2 ? `${client.allEmojis.check_mark} \`Hàng chờ\`` : `${client.allEmojis.check_mark} \`Bài hát\`` : `${client.allEmojis.x}`}`, true)
						.addField(`↪️ Tự động phát:`, `>>> ${newQueue.autoplay ? `${client.allEmojis.check_mark}` : `${client.allEmojis.x}`}`, true)
						.addField(`⬇️ Tải xuống bài hát:`, `>>> [\`Click here\`](${newTrack.streamURL})`, true)
						.addField(`❔ Filter${newQueue.filters.length > 0 ? "s": ""}:`, `>>> ${newQueue.filters && newQueue.filters.length > 0 ? `${newQueue.filters.map(f=>`\`${f}\``).join(`, `)}` : `${client.allEmojis.x}`}`, newQueue.filters.length > 1 ? false : true)
						.addField(`<:Youtube:840260133686870036>  View${newTrack.views > 0 ? "s": ""}:`, `>>> \`${newTrack.views}\``, true)
						.addField(`:thumbsup: Like${newTrack.likes > 0 ? "s": ""}:`, `>>> \`${newTrack.likes}\``, true)
						.addField(`:thumbsdown: Dislike${newTrack.dislikes > 0 ? "s": ""}:`, `>>> \`${newTrack.dislikes}\``, true)
						.setThumbnail(`https://img.youtube.com/vi/${newTrack.id}/mqdefault.jpg`)
						.setFooter(`Phát tại: ${guild.name}`, guild.iconURL({
							dynamic: true
						})).setTimestamp()
					]
				}).catch((e) => {
					onsole.log(e.stack ? e.stack : e)
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
