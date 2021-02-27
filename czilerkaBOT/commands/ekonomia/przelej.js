const Discord = require('discord.js')
const moment = require('moment-timezone')
const qdb = require(`quick.db`)
const config = require(`../../Config/config.json`)

module.exports = {
	name: "przelej",
	triggers: [
		["przelej"],
	],
	description: "Shows info about you/provided user.",
	category: "users",
	args: true,
	usage: "(@user/user ID)",
	async run(client, message, args) {
		if (!args[0]) {
			let embed = new Discord.MessageEmbed()
				.setColor('#fffb00')
				.setAuthor('Czilerka',client.user.avatarURL({ dynamic: true }))
				.setDescription(`<:nie:767387690248437840> | Nie podano użytkownika`)
			embed.setTimestamp(message.createdAt);
			return message.channel.send(embed);
		}
		let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
		if (!user) {
			let embed = new Discord.MessageEmbed()
				.setColor('#fffb00')
				.setAuthor('Czilerka',client.user.avatarURL({ dynamic: true }))
				.setDescription(`<:nie:767387690248437840> | Nieznaleziono użytkownika`)
			embed.setTimestamp(message.createdAt);
			return message.channel.send(embed);
		}
		if (!args[1]) {
			let embed = new Discord.MessageEmbed()
				.setColor('#fffb00')
				.setAuthor('Czilerka', client.user.avatarURL({ dynamic: true }))
				.setDescription(lang.noAmount)
			embed.setTimestamp(message.createdAt);
			return message.channel.send(embed);
		}
		if (isNaN(args[1])) {
			let embed = new Discord.MessageEmbed()
				.setColor('#fffb00')
				.setAuthor('Czilerka', client.user.avatarURL({ dynamic: true }))
				.setDescription(lang.invalidNumber)
			embed.setTimestamp(message.createdAt);
			return message.channel.send(embed);
		}
		let amount = Number(args[1]);
		amount = parseInt(amount)
		if (amount <= 0) {
			let embed = new Discord.MessageEmbed()
				.setColor('#fffb00')
				.setAuthor('Czilerka', client.user.avatarURL({ dynamic: true }))
				.setDescription(lang.onlyPositive)
			embed.setTimestamp(message.createdAt);
			return message.channel.send(embed);
		}

		let money1 = qdb.fetch(`money_${message.guild.id}_${message.member.id}`);
		if (!money1) {
			qdb.set(`money_${message.guild.id}_${message.member.id}`, 0);
		}

		let money2 = qdb.fetch(`money_${message.guild.id}_${user.id}`);
		if (!money2) {
			qdb.set(`money_${message.guild.id}_${user.id}`, 0);
		}

		if (amount > money1) {
			let embed = new Discord.MessageEmbed()
				.setColor('#fffb00')
				.setAuthor('Czilerka', client.user.avatarURL({ dynamic: true }))
				.setDescription(lang.notEnough)
			embed.setTimestamp(message.createdAt);
			return message.channel.send(embed);
		}

		qdb.subtract(`money_${message.guild.id}_${message.member.id}`, amount)
		qdb.add(`money_${message.guild.id}_${user.id}`, amount)

		let embed = new Discord.MessageEmbed()
			.setColor('#fffb00')
			.setAuthor('Czilerka', client.user.avatarURL({ dynamic: true }))
			.setDescription(`<a:tak:767605532450095115> **|** Przelałeś właśnie użytkownikowi ${user} <a:czokobonsy:767191684458872843> ${amount} czokobonsów`)
			.addField(`${message.member.user.tag}`, `-<a:czokobonsy:767191684458872843> ${amount}`, true)
			.addField(`${user.user.tag}`, `+<a:czokobonsy:767191684458872843> ${amount}`, true)

		embed.setTimestamp(message.createdAt);
		embed.setFooter(message.member.user.tag, message.member.user.displayAvatarURL({ format: 'png', dynamic: true }))

		let kanal = message.guild.channels.cache.find(channel => channel.id === `800504920247107584`)
		if (!kanal) return message.channel.send(embed);
		let embedzik = new Discord.MessageEmbed()
			.setColor('#fffb00')
			.setAuthor('Czilerka',client.user.avatarURL({ dynamic: true }))
			.setDescription(`Użytkownik ${message.member} przelał właśnie ${user} <a:czokobonsy:767191684458872843> ${amount} czokobonsów`)
			.setTimestamp()
		kanal.send(embedzik)

		message.channel.send(embed);
	}
};