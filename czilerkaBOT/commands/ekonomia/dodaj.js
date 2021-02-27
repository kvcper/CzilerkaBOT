const Discord = require('discord.js')
const moment = require('moment-timezone')
const qdb = require(`quick.db`)
const levele = new qdb.table('levele')
const config = require(`../../Config/config.json`)
const ownerID = ["", ""]
const fs = require("fs");
const leveles = JSON.parse(fs.readFileSync("./Config/levele.json", "utf8"));
const rangi = JSON.parse(fs.readFileSync("./Config/rangi.json", "utf8"));
const rangivc = JSON.parse(fs.readFileSync("./Config/rangivc.json", "utf8"));

async function rolinio(nowarola, stararola, user, guild) {
	const mMember = user.member || guild.members.cache.get(user.id)
	let nowarolacheck = guild.roles.cache.find(x => x.id == nowarola.id);
	await mMember.roles.add(nowarolacheck.id);
}

async function lvlcheck(client, guild, user, levelez, daliexp, levelObj) {
	if (daliexp >= leveles[levelez + 1] && levelez != 150) {
		daliexp = daliexp - leveles[levelez + 1];
		levelez = levelez + 1;
		lvlcheck(client, guild, user, levelez, daliexp, levelObj);
	} else {
		if (levelObj.level != levelez) {
			let kanal = guild.channels.cache.get(`810430632378499095`)
			kanal.send(`Gratulacje ${user}! Osiągnięto poziom tekstowy ${levelez}!`)
		}
		levelObj.level = levelez;
		levelObj.TextXP = daliexp;
		levelObj.ReqTextXP = leveles[levelez + 1];
		levele.set(`level_${guild.id}_${user.id}`, levelObj);
		await Object.entries(rangi).forEach(([key, value]) => {
			if (user.roles.cache.find(r => r.name === value)) {
				user.roles.remove(guild.roles.cache.find(x => x.name === value));
			}
		});
		var i = 160;
		for (; i > 0;) {
			i -= 10;
			if (levelObj.level >= i) {
				if (i == 0)
					return rolinio(
						guild.roles.cache.find(r => r.name === rangi[i]),
						guild.roles.cache.find(r => r.name === rangi[i]),
						user,
						guild
					);
				if (i !== 0)
					return rolinio(
						guild.roles.cache.find(r => r.name === rangi[i]),
						guild.roles.cache.find(r => r.name === rangi[i - 10]),
						user,
						guild
					);
			}
		}
	}
}

async function lvlcheckvc(client, guild, user, levelez, daliexp, levelObj) {
	if (daliexp >= leveles[levelez + 1] && levelez != 150) {
		daliexp = daliexp - leveles[levelez + 1];
		levelez = levelez + 1;
		lvlcheckvc(client, guild, user, levelez, daliexp, levelObj);
	} else {
		if (levelObj.levelVC != levelez) {
			let kanal = guild.channels.cache.get(`810430632378499095`)
			kanal.send(`Gratulacje ${user}! Osiągnięto poziom głosowy ${levelez}!`)
		}
		levelObj.levelVC = levelez;
		levelObj.VCXP = daliexp;
		levelObj.ReqVCXP = leveles[levelez + 1];
		levele.set(`level_${guild.id}_${user.id}`, levelObj);
		await Object.entries(rangivc).forEach(([key, value]) => {
			if (user.roles.cache.find(r => r.name === value)) {
				user.roles.remove(guild.roles.cache.find(x => x.name === value));
			}
		});
		var i = 160;
		for (; i > 0;) {
			i -= 10;
			if (levelObj.levelVC >= i) {
				if (i == 0)
					return rolinio(
						guild.roles.cache.find(r => r.name === rangivc[i]),
						guild.roles.cache.find(r => r.name === rangivc[i]),
						user,
						guild
					);
				if (i !== 0)
					return rolinio(
						guild.roles.cache.find(r => r.name === rangivc[i]),
						guild.roles.cache.find(r => r.name === rangivc[i - 10]),
						user,
						guild
					);
			}
		}
	}
}

module.exports = {
	name: "add",
	triggers: [
		["add"],
	],
	description: "Shows info about you/provided user.",
	category: "users",
	args: true,
	usage: "(@user/user ID)",
	async run(client, message, args) {
		if (args[0] == `money` || args[0] == `pieniadze` || args[0] == `pieniądze`) {
			if (!ownerID.includes(message.author.id)) return message.channel.send("Przykro mi, nie możesz użyc tej komendy ponieważ właściciel ma tylko do niej dostęp!")
			if (!args[0]) {
				let embed = new Discord.MessageEmbed()
					.setColor('#fffb00')
					.setAuthor('Czilerka', client.user.avatarURL({ dynamic: true }))
					.setDescription(`<:nie:767387690248437840> | Nie podano użytkownika`)
				embed.setTimestamp(message.createdAt);
				return message.channel.send(embed);
			}
			let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
			if (!user) {
				let embed = new Discord.MessageEmbed()
					.setColor('#fffb00')
					.setAuthor('Czilerka', client.user.avatarURL({ dynamic: true }))
					.setDescription(`<:nie:767387690248437840> | Nieznaleziono użytkownika`)
				embed.setTimestamp(message.createdAt);
				return message.channel.send(embed);
			}
			if (!args[1]) return message.channel.send(`Podaj kwote`);
			if (isNaN(args[1])) return message.channel.send(`Zły numer`);
			let amount = Number(args[1]);
			if (amount <= 0) return message.channel.send((`Podaj poprawną ilość`));

			let money = qdb.fetch(`money_${message.guild.id}_${user.id}`);
			if (!money) {
				qdb.set(`money_${message.guild.id}_${user.id}`, 0);
			} qdb.add(`money_${message.guild.id}_${user.id}`, amount)


			let embed = new Discord.MessageEmbed()
				.setColor('#fffb00')
				.setAuthor('Czilerka', client.user.avatarURL({ dynamic: true }))
				.setDescription(`<a:tak:767605532450095115> **|** Gratuluje! Dodano <a:czokobonsy:770559769706233876> ${amount} czokobonsów do salda użytkownika ${user}`)
			embed.setTimestamp(message.createdAt);
			embed.setFooter(user.user.tag, user.user.displayAvatarURL({ format: 'png', dynamic: true }))

			return message.channel.send(embed);
		} if (args[0] == `exp`) {
			if (!ownerID.includes(message.author.id)) return message.channel.send("Przykro mi, nie możesz użyc tej komendy ponieważ właściciel ma tylko do niej dostęp!")
			if (args[1] == `tekstowe` || args[1] == `text` || args[1] == `t` || args[1] == `chat`) {
				let member = message.mentions.members.first() || message.guild.members.cache.get(args[2])
				if (!member) return message.channel.send(`Nie znaleziono użytkownika!`)
				let i = parseInt(args[3])
				if (isNaN(i)) return message.channel.send(`Podaj poprawną ilość!`)

				let levelObj = levele.get(`level_${member.guild.id}_${member.id}`);
				if (!levelObj) {
					levelObj = {
						level: 0,
						TextXP: 0,
						ReqTextXP: leveles[1],
						levelVC: 0,
						VCXP: 0,
						ReqVCXP: leveles[1],
						rep: 0
					};
					levele.set(`level_${member.guild.id}_${member.id}`, levelObj);
					levelObj = levele.get(`level_${member.guild.id}_${member.id}`);
					levele.set(`GlobalTextXP_${member.guild.id}_${member.id}`, 0);
					levele.set(`GlobalVCXP_${member.guild.id}_${member.id}`, 0);
				}
				let dodane = levelObj.TextXP + i;
				levelObj.TextXP += i;
				await lvlcheck(
					client,
					member.guild,
					member,
					levelObj.level,
					dodane,
					levelObj
				);
				levele.add(`GlobalTextXP_${member.guild.id}_${member.id}`, i)
				return message.channel.send(`dodano ${i} expa tekstowego`)
			} if (args[1] == `voice` || args[1] == `głosowe` || args[1] == `vc` || args[1] == `v` || args[1] == `głosowy`) {
				let member = message.mentions.members.first() || message.guild.members.cache.get(args[2])
				if (!member) return message.channel.send(`Nie znaleziono użytkownika!`)
				let i = parseInt(args[3])
				if (isNaN(i)) return message.channel.send(`Podaj poprawną ilość!`)

				let levelObj = levele.get(`level_${member.guild.id}_${member.id}`);
				if (!levelObj) {
					levelObj = {
						level: 0,
						TextXP: 0,
						ReqTextXP: leveles[1],
						levelVC: 0,
						VCXP: 0,
						ReqVCXP: leveles[1],
						rep: 0
					};
					levele.set(`level_${member.guild.id}_${member.id}`, levelObj);
					levelObj = levele.get(`level_${member.guild.id}_${member.id}`);
					levele.set(`GlobalTextXP_${member.guild.id}_${member.id}`, 0);
					levele.set(`GlobalVCXP_${member.guild.id}_${member.id}`, 0);
				}
				let dodane = levelObj.VCXP + i;
				levelObj.VCXP += i;
				await lvlcheckvc(
					client,
					member.guild,
					member,
					levelObj.levelVC,
					dodane,
					levelObj
				);
				levele.add(`GlobalVCXP_${member.guild.id}_${member.id}`, i)
				return message.channel.send(`dodano ${i} expa vc`)
			} else return message.channel.send(`exp text/voice`)
		} else return
	}
};