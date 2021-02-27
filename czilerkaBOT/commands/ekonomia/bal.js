const Discord = require('discord.js')
const moment = require('moment-timezone')
const qdb = require(`quick.db`)
const config = require(`../../Config/config.json`)

module.exports = {
	name: "bal",
	triggers: [
		["bal"],
	],
	description: "Shows info about you/provided user.",
	category: "users",
	args: true,
	aliases: [`balance`, `money`],
	usage: "(@user/user ID)",
	async run(client, message, args) {
		let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
		if (!user) user = message.author
		let money = qdb.fetch(`money_${message.guild.id}_${user.id}`);
		if (!money) {
			qdb.set(`money_${message.guild.id}_${user.id}`, 0);
		}

		let bank = qdb.fetch(`bank_${message.guild.id}_${user.id}`);
		if (!bank) {
			qdb.set(`bank_${message.guild.id}_${user.id}`, 0);
		}

		let kasa = qdb.fetch(`kasa_${message.guild.id}_${user.id}`);
		if (!kasa) {
			qdb.set(`kasa_${message.guild.id}_${user.id}`, money += bank);
		} qdb.set(`kasa_${message.guild.id}_${user.id}`, money += bank);

		let every = qdb
			.all()
			.filter(i => i.ID.startsWith(`kasa_`))
			.sort((a, b) => b.data - a.data)
		var rank = every.map(x => x.ID).indexOf(`kasa_${message.guild.id}_${user.id}`) + 1

		let embed = new Discord.MessageEmbed()
		embed.setAuthor('Czilerka', client.user.avatarURL({ dynamic: true }))
		embed.setColor('#fffb00')
		embed.setDescription(`**<a:dolar:767380238212136991> Balans ${user} | Top #${rank}**`)
		embed.addField("Balans", `${config.moneyEmoji} ` + (qdb.fetch(`money_${message.guild.id}_${user.id}`) ? qdb.get(`money_${message.guild.id}_${user.id}`) : 0), true)
		embed.addField("Bank", `${config.moneyEmoji} ` + (qdb.fetch(`bank_${message.guild.id}_${user.id}`) ? qdb.get(`bank_${message.guild.id}_${user.id}`) : 0), true)
		embed.addField("Suma", `${config.moneyEmoji} ` + ((qdb.fetch(`money_${message.guild.id}_${user.id}`) ? qdb.get(`money_${message.guild.id}_${user.id}`) : 0) + (qdb.fetch(`bank_${message.guild.id}_${user.id}`) ? qdb.get(`bank_${message.guild.id}_${user.id}`) : 0)), true)
		embed.setTimestamp(message.createdAt);
		embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))

		message.channel.send(embed);
	}
}