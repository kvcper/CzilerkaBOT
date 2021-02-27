const Discord = require('discord.js')
const moment = require('moment-timezone')
const qdb = require(`quick.db`)
const guildConfig = require(`../../Config/config.json`)
const lang = require(`../../Config/lang.js`)
const ownerID = ["", ""]

module.exports = {
	name: "usuń",
	triggers: [
		["usuń"],
	],
	description: "Shows info about you/provided message.member.user.",
	category: "message.member.users",
	aliases: ["usun", "del", "remove"],
	args: true,
	usage: "(@message.member.user/message.member.user ID)",
	async run(client, message, args) {
		if (args[0] == `money`) {
			if (!ownerID.includes(message.author.id)) return message.channel.send("Przykro mi, nie możesz użyc tej komendy ponieważ właściciel ma tylko do niej dostęp!")
			if (!args[1]) return message.channel.send(lang.noTargetUser);
			let member = await message.mentions.members.first() || await message.guild.members.cache.get(args[1])
			if (!member) {
				let embed = new Discord.MessageEmbed()
					.setColor('#fffb00')
					.setAuthor('Wszystkie Komendy Bota Czilerka', client.user.avatarURL({ dynamic: true }))
					.setDescription(lang.noUser)
				embed.setTimestamp(message.createdAt);
				return message.channel.send(embed);
			}

			if (!args[2]) {
				let embed = new Discord.MessageEmbed()
					.setColor('#fffb00')
					.setAuthor('Czilerka', client.user.avatarURL({ dynamic: true }))
					.setDescription(lang.noAmount)
				embed.setTimestamp(message.createdAt);
				return message.channel.send(embed);
			}
			if (isNaN(args[2])) {
				let embed = new Discord.MessageEmbed()
					.setColor('#fffb00')
					.setAuthor('Czilerka', client.user.avatarURL({ dynamic: true }))
					.setDescription(lang.invalidNumber)
				embed.setTimestamp(message.createdAt);
				return message.channel.send(embed);
			}
			let amount = Number(args[2]);
			if (amount <= 0) {
				let embed = new Discord.MessageEmbed()
					.setColor('#fffb00')
					.setAuthor('Czilerka', client.user.avatarURL({ dynamic: true }))
					.setDescription(lang.onlyPositive)
				embed.setTimestamp(message.createdAt);
				return message.channel.send(embed);
			}

			let money = qdb.fetch(`money_${message.guild.id}_${member.id}`);
			if (!money) {
				qdb.set(`money_${message.guild.id}_${member.id}`, 0);
			}

			qdb.subtract(`money_${message.guild.id}_${member.id}`, amount)

			let embed = new Discord.MessageEmbed()
				.setAuthor(message.member.tag, message.member.user.displayAvatarURL())
				.addField(member.user.tag, `-${guildConfig.moneyEmoji} ${amount}`)
				.setTimestamp(message.createdAt);

			message.channel.send(embed);
		}
	}
};