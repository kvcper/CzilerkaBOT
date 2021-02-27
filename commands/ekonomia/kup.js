const Discord = require('discord.js')
const moment = require('moment-timezone')
const qdb = require(`quick.db`)
const config = require(`../../Config/config.json`)
const latinize = require(`latinize`)

module.exports = {
	name: "kup",
	triggers: [
		["kup"],
	],
	description: "Shows info about you/provided user.",
	category: "users",
	args: true,
	usage: "(@user/user ID)",
	async run(client, message, args) {
		let shopItemName = (args.shift() || "").toLowerCase();
		if (!shopItemName) {
			let embed = new Discord.MessageEmbed()
				.setColor('#fffb00')
				.setAuthor('Czilerka', client.user.avatarURL({ dynamic: true }))
				.setDescription(lang.noShopItemId)
			embed.setTimestamp(message.createdAt);
			return message.channel.send(embed);
		}
		let shopItem = Object.values(shop).find((shopItem) => (latinize(shopItem.name.toLowerCase()) == latinize(shopItemName)));
		if (!shopItem) {
			let embed = new Discord.MessageEmbed()
				.setColor('#fffb00')
				.setAuthor('Czilerka', client.user.avatarURL({ dynamic: true }))
				.setDescription(lang.noShopItem)
			embed.setTimestamp(message.createdAt);
			return message.channel.send(embed);
		}
		shopItem.onBuy({ args, guild:message.guild, member: message.member, guildConfig:config }).then(() => {
			let embed = new Discord.MessageEmbed()
				.setColor('#fffb00')
				.setAuthor('Czilerka',client.user.avatarURL({ dynamic: true }))
				.setDescription(lang.buySuccess({ member, shopItem }))
			embed.setTimestamp(message.createdAt);

			let kanal = guild.channels.cache.find(channel => channel.id === `800504919311908864`)
			let embedzik = new Discord.MessageEmbed()
				.setColor('#fffb00')
				.setAuthor('Czilerka',client.user.avatarURL({ dynamic: true }))
				.setDescription(`Użytkownik ${member} zakupił ${shopItem}`)
				.setTimestamp()
			kanal.send(embedzik)

			return message.channel.send(embed);
		}).catch((error) => {
			console.error(error);
			let embed = new Discord.MessageEmbed()
				.setColor('#fffb00')
				.setAuthor('Czilerka',client.user.avatarURL({ dynamic: true }))
				.setDescription(lang.buyFail({ member:message.member, shopItem, error }))
			message.channel.send(embed);
		});
	}
};