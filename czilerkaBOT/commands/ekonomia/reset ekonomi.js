const Discord = require('discord.js')
const moment = require('moment-timezone')
const qdb = require(`quick.db`)
const config = require(`../../Config/config.json`)
const ownerID = ["", ""]

module.exports = {
	name: "reset",
	triggers: [
		["reset"],
	],
	description: "Shows info about you/provided user.",
	category: "users",
	args: true,
	usage: "(@user/user ID)",
	async run(client, message, args) {
		if(args[0] == `economy` || args[0] == `ekonomii` || args[0] == `ekonomi` ){
			if (!ownerID.includes(message.author.id)) return message.channel.send("Przykro mi, nie możesz użyc tej komendy ponieważ właściciel ma tylko do niej dostęp!")
			let every = qdb.all()
			every.filter(i => i.ID.startsWith(`money_`)).forEach((money)=>{
				let guild = money.ID.split('_')[1]
				let user = money.ID.split('_')[2]
				qdb.set(`money_${message.guild.id}_${user}`, 0)
			});
	
			every.filter(i => i.ID.startsWith(`bank_`)).forEach((bank)=>{
				let guild = bank.ID.split('_')[1]
				let user = bank.ID.split('_')[2]
				qdb.set(`bank_${message.guild.id}_${user}`, 0)
			});
	
			every.filter(i => i.ID.startsWith(`kasa_`)).forEach((bank)=>{
				let guild = bank.ID.split('_')[1]
				let user = bank.ID.split('_')[2]
				qdb.set(`kasa_${message.guild.id}_${user}`, 0)
			});
			
			let embed=new Discord.MessageEmbed()
			.setColor('#fffb00')
			.setAuthor('Czilerka',client.user.avatarURL({ dynamic: true }))
			.setDescription(lang.economyResetted)
			embed.setTimestamp();
			message.channel.send(embed);
		}
	}
};