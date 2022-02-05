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
	name: "move", //the command name for the Slash Command

	category: "Queue",
	usage: "move <WhatSong> <ToWhere>",

	description: "Di chuyển một bài hát đến một nơi khác", //the command description for Slash Command Overview
	cooldown: 10,
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
				if (check_if_dj(client, member, newQueue.songs[0])) {
					return message.reply({
						embeds: [new MessageEmbed()
							.setColor(ee.wrongcolor)
							.setFooter(ee.footertext, ee.footericon)
							.setTitle(`${client.allEmojis.x} **Bạn không phải là DJ và cũng không phải là người yêu cầu!**`)
							.setDescription(`**DJ-ROLES:**\n> ${check_if_dj(client, member, newQueue.songs[0])}`)
						],
					});
				}
				if (!args[0]) {
					return message.reply({
						embeds: [new MessageEmbed()
							.setColor(ee.wrongcolor)
							.setFooter(ee.footertext, ee.footericon)
							.setTitle(`${client.allEmojis.x} **Vui lòng thêm vị trí bài hát!**`)
							.setDescription(`**Usage:**\n> \`${client.settings.get(message.guild.id, "prefix")}move <SongPosition> <ToPosition>\``)
						],
					});
				}
				if (!args[1]) {
					return message.reply({
						embeds: [new MessageEmbed()
							.setColor(ee.wrongcolor)
							.setFooter(ee.footertext, ee.footericon)
							.setTitle(`${client.allEmojis.x} **Vui lòng thêm một vị trí Để di chuyển!**`)
							.setDescription(`**Usage:**\n> \`${client.settings.get(message.guild.id, "prefix")}play <SongPosition> <ToPosition>\``)
						],
					});
				}
				let songIndex = Number(args[0]);
				if (!songIndex) {
					return message.reply({
						embeds: [new MessageEmbed()
							.setColor(ee.wrongcolor)
							.setFooter(ee.footertext, ee.footericon)
							.setTitle(`${client.allEmojis.x} **Vui lòng thêm vị trí bài nhạc!**`)
							.setDescription(`**Usage:**\n> \`${client.settings.get(message.guild.id, "prefix")}move <SongPosition> <ToPosition>\``)
						],
					});
				}
				let position = Number(args[1]);
				if (!position) {
					return message.reply({
						embeds: [new MessageEmbed()
							.setColor(ee.wrongcolor)
							.setFooter(ee.footertext, ee.footericon)
							.setTitle(`${client.allEmojis.x} **Vui lòng thêm vị trí bài nhạc!**`)
							.setDescription(`**Usage:**\n> \`${client.settings.get(message.guild.id, "prefix")}play <SongPosition> <ToPosition>\``)
						],
					});
				}
				if (position >= newQueue.songs.length || position < 0) position = -1;
				if (songIndex > newQueue.songs.length - 1) return message.reply({
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **Bài hát này không tồn tại!**`)
						.setDescription(`**Bài hát cuối cùng trong hàng đợi ở vị trí thứ: \`${newQueue.songs.length}\`**`)
					],

				})
				if (position == 0) return message.reply({
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **Không thể di chuyển bài hát trước khi phát!**`)
					],

				})
				let song = newQueue.songs[songIndex];
				//remove the song
				newQueue.songs.splice(songIndex);
				//Add it to a specific Position
				newQueue.addToQueue(song, position)
				message.reply({
					embeds: [new MessageEmbed()
					  .setColor(ee.color)
					  .setTimestamp()
					  .setTitle(`📑 Đã chuyể **${song.name}** đến **\`${position}th\`** Đặt ngay sau **_${newQueue.songs[position - 1].name}_!**`)
					  .setFooter(`💢 Yêu cầu của: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
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
