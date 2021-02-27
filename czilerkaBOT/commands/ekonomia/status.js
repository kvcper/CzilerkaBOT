const Discord = require('discord.js')
const moment = require('moment-timezone')
const qdb = require(`quick.db`)
const config = require(`../../Config/config.json`)

module.exports = {
	name: "status",
	triggers: [
		["status"],
	],
	description: "Shows info about you/provided user.",
	category: "users",
	args: true,
	usage: "(@user/user ID)",
	async run(client, message, args) {
		if (!args[0]) return message.channel.send(`Wpisz status vip`);
		if (args[0] == `vip`) {
			let rola = message.guild.roles.cache.find(r => r.id === `800504230015664149`)
			if (message.member.roles.cache.has(rola.id)) {
				let czas = qdb.get(`vipkoniec_${message.guild.id}_${message.author.id}`)
				if (!czas) return message.channel.send(`Nie znaleziono cie w bazie danych! Skontaktuj się z administratorem!`)
				moment.locale(`pl`)
				let embed = new Discord.MessageEmbed()
					.setColor('#fffb00')
					.setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
					.setDescription(`<:vip:772856948269908048> Twój VIP jest jeszcze ważny do **\`${moment(qdb.get(`vipkoniec_${message.guild.id}_${message.author.id}`)).format(`LLL`)}\`**`)
					.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
					.setTimestamp(message.createdAt)
				message.channel.send(embed);
			} else {
				let embed = new Discord.MessageEmbed()
					.setColor('#fffb00')
					.setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
					.setDescription(`<:nie:767387690248437840> **|** Nie posiadasz rangi VIP`)
					.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
					.setTimestamp(message.createdAt)
				message.channel.send(embed);
			}
		} 
	}
};