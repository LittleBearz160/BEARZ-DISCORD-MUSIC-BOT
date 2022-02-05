const {
	MessageEmbed,
	Message
} = require("discord.js");
const {
    KSoftClient
} = require('@ksoft/api');
const config = require(`../../botconfig/config.json`);
const ksoft = new KSoftClient(config.ksoftapi);
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const {
	lyricsEmbed,
	check_if_dj
} = require("../../handlers/functions");
module.exports = {
	name: "lyrics", //the command name for the Slash Command
	category: "Song",
	usage: "lyrics",
	aliases: ["ly", "songtext"],
	description: "Gửi về lyric của bài hát", //the command description for Slash Command Overview
	cooldown: 25,
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
				return message.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter(ee.footertext, ee.footericon)
						.setTitle(`${client.allEmojis.x} Lyric đã tắt!`)
						.setDescription(`**Do lý do pháp lý, Lời bài hát bị vô hiệu hóa và sẽ không hoạt động trong một khoảng thời gian không xác định!** :cry:`)
					],
				});
				let embeds = [];
				await ksoft.lyrics.get(newQueue.songs[0].name).then(
					async track => {
						if (!track.lyrics) return message.reply({
							content: `${client.allEmojis.x} **Không tìm thấy lời bài hát!** :cry:`,
						});
						lyrics = track.lyrics;
						embeds = lyricsEmbed(lyrics, newQueue.songs[0]);
					}).catch(e => {
					console.log(e)
					return message.reply({
						content: `${client.allEmojis.x} **Không tìm thấy lời bài hát!** :cry:\n${String(e).substr(0, 1800)}`,
					});
				})
				message.reply({
					embeds: embeds,
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
