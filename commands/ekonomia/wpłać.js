const Discord = require('discord.js')
const moment = require('moment-timezone')
const qdb = require(`quick.db`)
const guildConfig = require(`../../Config/config.json`)
const lang = require(`../../Config/lang.js`)

module.exports = {
    name: "wpłać",
    triggers: [
        ["wpłać"],
    ],
    description: "Shows info about you/provided message.member.user.",
	category: "message.member.users",
	aliases: ["wplac"],
    args: true,
    usage: "(@message.member.user/message.member.user ID)",
    async run(client, message, args) {
		if (!args[0]) return message.channel.send(`${lang.noAmount}`);
		if (isNaN(args[0])) return message.channel.send(lang.invalidNumber);
		let amount=Number(args[0]);
		if (amount <= 0) {
			let embed=new Discord.MessageEmbed()
		.setColor('#fffb00')
		.setAuthor('Czilerka',client.user.avatarURL({dynamic:true}))
		.setDescription(lang.onlyPositive)
		embed.setTimestamp(message.createdAt);
		return message.channel.send(embed);
		}

		let money= qdb.fetch(`money_${message.guild.id}_${message.member.id}`);
			if (!money){
				qdb.set(`money_${message.guild.id}_${message.member.id}`, 0);
			}

		if (amount > money){
			let embed=new Discord.MessageEmbed()
		.setColor('#fffb00')
		.setAuthor('Czilerka',client.user.avatarURL({dynamic:true}))
		.setDescription(lang.notEnough)
		embed.setTimestamp(message.createdAt);
		return message.channel.send(embed);
		}

		qdb.subtract(`money_${message.guild.id}_${message.member.id}`, amount)
		qdb.add(`bank_${message.guild.id}_${message.member.id}`, amount)
		let embed=new Discord.MessageEmbed()
		.setAuthor(message.member.user.tag, message.member.user.displayAvatarURL())
		.addField(`${message.member.user.tag}`, `-${guildConfig.moneyEmoji} ${amount}`)
		.addField(`BANK ${message.member.user.tag}`, `+${guildConfig.moneyEmoji} ${amount}`)
		.setTimestamp(message.createdAt);

		message.channel.send(embed);
	}
};