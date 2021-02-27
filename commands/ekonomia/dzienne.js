const Discord = require('discord.js')
const moment = require('moment-timezone')
const qdb = require(`quick.db`)
const guildConfig = require(`../../Config/config.json`)

module.exports = {
	name: "dzienne",
	triggers: [
		["dzienne", "dzienna"],
	],
	description: "Shows info about you/provided user.",
	category: "users",
	args: true,
	usage: "(@user/user ID)",
	async run(client, message, args) {
		if(args[0] != `nagroda`) return
		if (!message.member.roles.cache.has("743845942553346175")) return message.channel.send(lang.noPermission);

		if (Date.now()-(qdb.fetch(`lastdaily_${message.guild.id}_${message.author.id}`) ? qdb.get(`lastdaily_${message.guild.id}_${message.author.id}`) : 0) >= 86400000) { // 30 s cooldown
			let money = qdb.fetch(`money_${message.guild.id}_${message.author.id}`);
			if (!money){
				qdb.set(`money_${message.guild.id}_${message.author.id}`, 0);
			} qdb.add(`money_${message.guild.id}_${message.author.id}`, 200)

			let lastdaily = qdb.fetch(`lastdaily_${message.guild.id}_${message.author.id}`);
			if (!lastdaily){
				qdb.set(`lastdaily_${message.guild.id}_${message.author.id}`, Date.now());
			} qdb.set(`lastdaily_${message.guild.id}_${message.author.id}`, Date.now())

			let embed=new Discord.MessageEmbed()
			.setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic:true}))
			.addField(`${message.member.user.tag}`, `+${guildConfig.moneyEmoji} 200`)
			.setTimestamp(message.createdAt);
	
			message.channel.send(embed);
		} else return message.channel.send(lang.dailyCooldown);

	}
};