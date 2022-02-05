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
	name: "status", //the command name for the Slash Command

	category: "Queue",
	aliases: ["stats"],
	usage: "status",

	description: "Hiển thị trạng thái hàng chờ", //the command description for Slash Command Overview
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
				var djs = client.settings.get(newQueue.id, `djroles`);
				if(!djs || !Array.isArray(djs)) djs = [];
				else djs = djs.map(r => `<@&${r}>`);
				if(djs.length == 0 ) djs = "`not setup`";
				else djs.slice(0, 15).join(", ");
				let newTrack = newQueue.songs[0];
				let embed = new MessageEmbed().setColor(ee.color)
					.setDescription(`Xem hàng chờ trực tiếp tại [ **DASHBOARD** ](http://dashboard.musicium.eu/queue/${newQueue.id})`)
					.addField(`💡 Yêu cầu của:`, `>>> ${newTrack.user}`, true)
					.addField(`⏱ Thời lượng:`, `>>> \`${newQueue.formattedCurrentTime} / ${newTrack.formattedDuration}\``, true)
					.addField(`🌀 List:`, `>>> \`${newQueue.songs.length} bài hát\`\n\`${newQueue.formattedDuration}\``, true)
					.addField(`🔊 Âm lượng:`, `>>> \`${newQueue.volume} %\``, true)
					.addField(`♾ Lặp:`, `>>> ${newQueue.repeatMode ? newQueue.repeatMode === 2 ? `${client.allEmojis.check_mark} \`Hàng chờ\`` : `${client.allEmojis.check_mark} \`Bài hát\`` : `${client.allEmojis.x}`}`, true)
					.addField(`↪️ Tự động phát:`, `>>> ${newQueue.autoplay ? `${client.allEmojis.check_mark}` : `${client.allEmojis.x}`}`, true)
					.addField(`⬇️Tải xuống bài hát:`, `>>> [\`Click here\`](${newTrack.streamURL})`, true)
					.addField(`❔ Filter${newQueue.filters.length > 0 ? "s": ""}:`, `>>> ${newQueue.filters && newQueue.filters.length > 0 ? `${newQueue.filters.map(f=>`\`${f}\``).join(`, `)}` : `${client.allEmojis.x}`}`, newQueue.filters.length > 1 ? false : true)
					.addField(`🎧 DJ-Role${djs.length > 1 ? "s": ""}:`, `>>> ${djs}`, djs.length > 1 ? false : true)
					.setAuthor(`${newTrack.name}`, `https://cdn.discordapp.com/attachments/919658410788679691/921980437629390878/discord-avatar-256-LQX9U.gif`, newTrack.url)
					.setThumbnail(`https://img.youtube.com/vi/${newTrack.id}/mqdefault.jpg`)
					.setFooter(`💯 ${newTrack.user.tag}`, newTrack.user.displayAvatarURL({
						dynamic: true
					}));
				message.reply({
					embeds: [embed]
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
