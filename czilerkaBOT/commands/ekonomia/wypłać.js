const Discord = require('discord.js')
const moment = require('moment-timezone')
const qdb = require(`quick.db`)
const guildConfig = require(`../../Config/config.json`)
const lang = require(`../../Config/lang.js`)

module.exports = {
    name: "wypłać",
    triggers: [
        ["wypłać"],
    ],
    description: "Shows info about you/provided message.member.user.",
	category: "message.member.users",
	aliases: ["wyplac"],
    args: true,
    usage: "(@message.member.user/message.member.user ID)",
    async run(client, message, args) {
		if (!args[0]){
			let embed=new Discord.MessageEmbed()
		.setColor('#fffb00')
		.setAuthor('Czilerka',client.user.avatarURL({dynamic:true}))
		.setDescription(lang.noAmount)
		embed.setTimestamp(message.createdAt);
		return message.channel.send(embed);
		}
		if (isNaN(args[0])){
			let embed=new Discord.MessageEmbed()
		.setColor('#fffb00')
		.setAuthor('Czilerka',client.user.avatarURL({dynamic:true}))
		.setDescription(lang.invalidNumber)
		embed.setTimestamp(message.createdAt);
		return message.channel.send(embed);
		}
		let amount=Number(args[0]);
		if (amount <= 0){
			let embed=new Discord.MessageEmbed()
		.setColor('#fffb00')
		.setAuthor('Czilerka',client.user.avatarURL({dynamic:true}))
		.setDescription(lang.onlyPositive)
		embed.setTimestamp(message.createdAt);
		return message.channel.send(embed);
		}
		let bank= qdb.fetch(`bank_${message.guild.id}_${message.member.id}`);
			if (!bank){
				qdb.set(`bank_${message.guild.id}_${message.member.id}`, 0);
			}

		if (amount > bank){
			let embed=new Discord.MessageEmbed()
		.setColor('#fffb00')
		.setAuthor('Czilerka',client.user.avatarURL({dynamic:true}))
		.setDescription(lang.notEnoughInBank)
		embed.setTimestamp(message.createdAt);
		return message.channel.send(embed);
		}

		qdb.add(`money_${message.guild.id}_${message.member.id}`, amount)
		qdb.subtract(`bank_${message.guild.id}_${message.member.id}`, amount)
		let embed=new Discord.MessageEmbed()
		.setAuthor(message.member.user.tag, message.member.user.displayAvatarURL())
		.addField(`${message.member.user.tag}`, `+${guildConfig.moneyEmoji} ${amount}`)
		.addField(`BANK ${message.member.user.tag}`, `-${guildConfig.moneyEmoji} ${amount}`)
		.setTimestamp(message.createdAt);

		message.channel.send(embed);
	}
};