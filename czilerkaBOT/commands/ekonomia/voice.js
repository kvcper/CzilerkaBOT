const Discord = require('discord.js')
const moment = require('moment-timezone')
const qdb = require(`quick.db`)
const guildConfig = require(`../../Config/config.json`)
const lang = require(`../../Config/lang.js`)
const latinize = require(`latinize`)

module.exports = {
	name: "voice",
	triggers: [
		["voice"],
	],
	description: "Shows info about you/provided message.member.user.",
	category: "message.member.users",
	aliases: ["kanał", "channel"],
	args: true,
	usage: "(@message.member.user/message.member.user ID)",
	async run(client, message, args) {
		let guild = message.guild
		if (!args[0]) {
			let embed = new Discord.MessageEmbed()
				.setColor('#fffb00')
				.setAuthor('Wszystkie Komendy Bota Czilerka', client.user.avatarURL({ dynamic: true }))
				.setDescription(`<:muzyka:771039366902317116> **Info o prywatnych kanałach głosowych.**
	
	**Głosowe komendy:**
	<:prawo:772128181133770763> \`voice blokuj\` - blokuje twój kanał tak aby nikt nie mógł na niego wchodzić.
	<:prawo:772128181133770763> \`voice odblokuj\` - odblokowuje twój kanał głosowy i każdy użytkownik może na niego wejść.
	<:prawo:772128181133770763> \`voice nazwa <nazwa>\` - zmieniasz nazwę swojego własnego kanału głosowego.
	<:prawo:772128181133770763> \`voice limit <liczba>\` - ustawiasz limit ile osób ma być na kanale.
	<:prawo:772128181133770763> \`voice permisje <@uzytkownik>\` - dajesz użytkownikowi premisje do edytowania twoim kanałem.
	<:prawo:772128181133770763> \`voice przedluz (24h/7d/30d)\` - przedłuża wynajmu twojego kanału głosowego.
	<:prawo:772128181133770763> \`voice dodaj <użytkownik>\` - zezwala na wchodzenia na twój kanał gdy jest nawet zablokowany.
	<:prawo:772128181133770763> \`voice zabierz <użytkownik>\` - zabiera użytkownikowi permisje.
	<:prawo:772128181133770763> \`voice wyrzuc <użytkownik>\` - zezwala na wchodzenia na twój kanał gdy jest nawet zablokowany.
	<:prawo:772128181133770763> \`voice czas\` -  pokazuje ile zostało czasu do kolejnej zapłaty wynajmu.
	
	**Komendy Administracyjne**
	<:prawo:772128181133770763> \`voice usun <ID użytkownika>\` - usuwa kanał prywatny.
	<:prawo:772128181133770763> \`voice stwórz <ID użytkownika>\` - dodaje kanał głosowy.
	
	<:znak:772128359022460938> **Za znalezione błędy nagroda w postaci czokobonsów** <:znak:772128359022460938>
	
	`)
			embed.setTimestamp(message.createdAt);
			embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))


			return message.channel.send(embed);
		} else {
			if (latinize(args[0]).toLowerCase() == `info`) {
				let embed = new Discord.MessageEmbed()
					.setColor('#fffb00')
					.setAuthor('Wszystkie Komendy Bota Czilerka', client.user.avatarURL({ dynamic: true }))
					.setDescription(`<:muzyka:771039366902317116> **Info o prywatnych kanałach głosowych.**
	
	**Głosowe komendy:**
	<:prawo:772128181133770763> \`voice blokuj\` - blokuje twój kanał tak aby nikt nie mógł na niego wchodzić.
	<:prawo:772128181133770763> \`voice odblokuj\` - odblokowuje twój kanał głosowy i każdy użytkownik może na niego wejść.
	<:prawo:772128181133770763> \`voice nazwa <nazwa>\` - zmieniasz nazwę swojego własnego kanału głosowego.
	<:prawo:772128181133770763> \`voice limit <liczba>\` - ustawiasz limit ile osób ma być na kanale.
	<:prawo:772128181133770763> \`voice permisje <@uzytkownik>\` - dajesz użytkownikowi premisje do edytowania twoim kanałem.
	<:prawo:772128181133770763> \`voice przedluz (24h/7d/30d)\` - przedłuża wynajmu twojego kanału głosowego.
	<:prawo:772128181133770763> \`voice dodaj <użytkownik>\` - zezwala na wchodzenia na twój kanał gdy jest nawet zablokowany.
	<:prawo:772128181133770763> \`voice zabierz <użytkownik>\` - zabiera użytkownikowi permisje.
	<:prawo:772128181133770763> \`voice wyrzuc <użytkownik>\` - zezwala na wchodzenia na twój kanał gdy jest nawet zablokowany.
	<:prawo:772128181133770763> \`voice czas\` -  pokazuje ile zostało czasu do kolejnej zapłaty wynajmu.
	
	**Komendy Administracyjne**
	<:prawo:772128181133770763> \`voice usun <ID użytkownika>\` - usuwa kanał prywatny.
	<:prawo:772128181133770763> \`voice stwórz <ID użytkownika>\` - dodaje kanał głosowy.
	
	<:znak:772128359022460938> **Za znalezione błędy nagroda w postaci czokobonsów** <:znak:772128359022460938>
	
	`)
				embed.setTimestamp(message.createdAt);
				embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))


				return message.channel.send(embed);
			}
			if (latinize(args[0]).toLowerCase() == `limit`) {
				if (qdb.get(`kanalID_${guild.id}_${message.author.id}`)) {
					if (!isNaN(args[1]) && args[1] >= 0 && args[1] < 100) {
						let kanal = guild.channels.cache.get(qdb.get(`kanalID_${guild.id}_${message.author.id}`))
						kanal.edit({ userLimit: args[1] })
						let embed = new Discord.MessageEmbed()
							.setColor('#fffb00')
							.setAuthor('Czilerka', client.user.avatarURL({ dynamic: true }))
							.setDescription(`<a:tak:767605532450095115> **|** Ustawiono limit użytkowników na kanale prywatnym do \`${args[1]}\``)
						embed.setTimestamp(message.createdAt);
						embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
						return message.channel.send(embed);
					} else {
						let embed = new Discord.MessageEmbed()
							.setColor('#fffb00')
							.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
							.setDescription(`<:nie:767387690248437840> **|** Podaj poprawną liczbę limitu uzytkowników na kanale`)
						embed.setTimestamp(message.createdAt);
						embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
						return message.channel.send(embed);
					}
				} else {
					let embed = new Discord.MessageEmbed()
						.setColor('#fffb00')
						.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
						.setDescription(`<:nie:767387690248437840> **|** Nie posiadasz kanału prywatnego`)
					embed.setTimestamp(message.createdAt);
					embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
					return message.channel.send(embed);
				}
			} if (latinize(args[0]).toLowerCase() == `przedluz`) {
				if (qdb.get(`kanalID_${guild.id}_${message.author.id}`)) {
					let kanal = guild.channels.cache.get(qdb.get(`kanalID_${guild.id}_${message.author.id}`))
					if (args[1] == `24h`) {
						if (qdb.get(`money_${guild.id}_${message.author.id}`) >= 3000) {
							qdb.subtract(`money_${guild.id}_${message.author.id}`, 3000)
							qdb.add(`kanalczas_${guild.id}_${message.author.id}`, 86400000);
							let embed = new Discord.MessageEmbed()
								.setColor('#fffb00')
								.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
								.setDescription(`<a:tak:767605532450095115> **|** Przedłużono ważność prywatnego kanału o \`24 Godziny\``)
							embed.setTimestamp(message.createdAt);
							embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
							return message.channel.send(embed);
						} else {
							let embed = new Discord.MessageEmbed()
								.setColor('#fffb00')
								.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
								.setDescription(`<:nie:767387690248437840> **|** Nie posiadasz 3000 ${guildConfig.moneyEmoji}`)
							embed.setTimestamp(message.createdAt);
							embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
							return message.channel.send(embed);
						}
					} if (args[1] == `7d`) {
						if (qdb.get(`money_${guild.id}_${message.author.id}`) >= 6000) {
							qdb.subtract(`money_${guild.id}_${message.author.id}`, 6000)
							qdb.add(`kanalczas_${guild.id}_${message.author.id}`, 604800000);
							let embed = new Discord.MessageEmbed()
								.setColor('#fffb00')
								.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
								.setDescription(`<a:tak:767605532450095115> **|** Przedłużono ważność prywatnego kanału użytkownika ${message.author} o \`7 Dni\``)
							embed.setTimestamp(message.createdAt);
							embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
							return message.channel.send(embed);
						} else {
							let embed = new Discord.MessageEmbed()
								.setColor('#fffb00')
								.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
								.setDescription(`<:nie:767387690248437840> **|** Nie posiadasz 6000 ${guildConfig.moneyEmoji}`)
							embed.setTimestamp(message.createdAt);
							embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
							return message.channel.send(embed);
						}
					} if (args[1] == `30d`) {
						if (qdb.get(`money_${guild.id}_${message.author.id}`) >= 19000) {
							qdb.subtract(`money_${guild.id}_${message.author.id}`, 19000)
							qdb.add(`kanalczas_${guild.id}_${message.author.id}`, 2592000000);
							let embed = new Discord.MessageEmbed()
								.setColor('#fffb00')
								.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
								.setDescription(`<a:tak:767605532450095115> **|** Przedłużono ważność prywatnego kanału użytkownika ${message.author} o \`30 Dni\``)
							embed.setTimestamp(message.createdAt);
							embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
							return message.channel.send(embed);
						} else {
							let embed = new Discord.MessageEmbed()
								.setColor('#fffb00')
								.setAuthor('Czilerk')
								.setDescription(`<:nie:767387690248437840> **|** Nie posiadasz 19000 ${guildConfig.moneyEmoji}`)
							embed.setTimestamp(message.createdAt);
							embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
							return message.channel.send(embed);
						}
					} else {
						let embed = new Discord.MessageEmbed()
							.setColor('#fffb00')
							.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
							.setDescription(`<:nie:767387690248437840> **|** o ile chcesz przedłużyć ważność kanału? 24h/7d/30d`)
						embed.setTimestamp(message.createdAt);
						embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
						return message.channel.send(embed);
					}
				} else {
					let embed = new Discord.MessageEmbed()
						.setColor('#fffb00')
						.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
						.setDescription(`<:nie:767387690248437840> **|** Nie posiadasz kanału prywatnego`)
					embed.setTimestamp(message.createdAt);
					embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
					return message.channel.send(embed);
				}
			} if (latinize(args[0]).toLowerCase() == `czas`) {
				if (qdb.get(`kanalID_${guild.id}_${message.author.id}`)) {
					moment.locale(`pl`)
					let kanal = guild.channels.cache.get(qdb.get(`kanalID_${guild.id}_${message.author.id}`))
					let embed = new Discord.MessageEmbed()
						.setColor('#fffb00')
						.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
						.setDescription(`<a:tak:767605532450095115> **|** Ważność twojego prywatnego kanału kończy się **\`${moment(qdb.get(`kanalczas_${guild.id}_${message.author.id}`)).format(`LLL`)}\`**`)
					embed.setTimestamp(message.createdAt);
					embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
					return message.channel.send(embed);
				} else {
					let embed = new Discord.MessageEmbed()
						.setColor('#fffb00')
						.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
						.setDescription(`<:nie:767387690248437840> **|** Nie posiadasz własnego kanały prywatnego`)
					embed.setTimestamp(message.createdAt);
					embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
					return message.channel.send(embed);
				}
			} if (latinize(args[0]).toLowerCase() == `nazwa`) {
				if (qdb.get(`kanalID_${message.guild.id}_${message.author.id}`)) {
					const nazwa = message.content.slice(12);
					if (nazwa && nazwa.length < 101) {
						let kanal = await message.guild.channels.cache.get(qdb.get(`kanalID_${message.guild.id}_${message.member.id}`))
						if (!kanal) return message.channel.send(`Nie znaleziono kanału!`)
						kanal.edit({ name: `${nazwa}` })

						let embed = new Discord.MessageEmbed()
							.setColor('#fffb00')
							.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
							.setDescription(`<a:tak:767605532450095115> **|** Zmieniono nazwe kanału prywatnego na ${nazwa}`)
						embed.setTimestamp(message.createdAt);
						embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
						return message.channel.send(embed);
					} else {
						let embed = new Discord.MessageEmbed()
							.setColor('#fffb00')
							.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
							.setDescription(`<:nie:767387690248437840> **|** Podaj nazwe kanału prywatnego`)
						embed.setTimestamp(message.createdAt);
						embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
						return message.channel.send(embed);
					}
				} else {
					let embed = new Discord.MessageEmbed()
						.setColor('#fffb00')
						.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
						.setDescription(`<:nie:767387690248437840> **|** Nie posiadasz własnego kanały prywatnego`)
					embed.setTimestamp(message.createdAt);
					embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
					return message.channel.send(embed);
				}
			} if (latinize(args[0]).toLowerCase() == `blokuj`) {
				if (qdb.get(`kanalID_${guild.id}_${message.author.id}`)) {
					let kanal = guild.channels.cache.get(qdb.get(`kanalID_${guild.id}_${message.author.id}`))
					kanal.edit({
						permissionOverwrites: [
							{
								id: guild.id,
								deny: [`CONNECT`],
							},
							{
								id: message.author.id,
								allow: [`CONNECT`, `MOVE_MEMBERS`, `MUTE_MEMBERS`, `PRIORITY_SPEAKER`, `SPEAK`, `STREAM`, `VIEW_CHANNEL`, `DEAFEN_MEMBERS`],
							},
						]
					})
					let embed = new Discord.MessageEmbed()
						.setColor('#fffb00')
						.setAuthor('Czilerka', client.user.avatarURL({ dynamic: true }))
						.setDescription(`<a:tak:767605532450095115> **|** Zablokowano prywatny kanał`)
					embed.setTimestamp(message.createdAt);
					embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
					return message.channel.send(embed);
				} else {
					let embed = new Discord.MessageEmbed()
						.setColor('#fffb00')
						.setAuthor('Czilerka', client.user.avatarURL({ dynamic: true }))
						.setDescription(`<:nie:767387690248437840> **|** Nie posiadasz własnego kanału prywatnego`)
					embed.setTimestamp(message.createdAt);
					embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
					return message.channel.send(embed);
				}
			} if (latinize(args[0]).toLowerCase() == `dodaj`) {
				let member = message.mentions.members.first() || message.guild.members.cache.get(args[1])
				if (member) {
					if (member.id == message.author.id) {
						let embed = new Discord.MessageEmbed()
							.setColor('#fffb00')
							.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
							.setDescription(`<:nie:767387690248437840> **|** Nie możesz dodać tej osoby do kanału prywatnego!`)
						return message.channel.send(embed);
					}
					if (qdb.get(`kanalID_${guild.id}_${message.author.id}`)) {
						let kanal = guild.channels.cache.get(qdb.get(`kanalID_${guild.id}_${message.author.id}`))
						kanal.updateOverwrite(member, { VIEW_CHANNEL: true, CONNECT: true, MANAGE_ROLES: null, MOVE_MEMBERS: null, MUTE_MEMBERS: null, PRIORITY_SPEAKER: null, SPEAK: true, STREAM: true, DEAFEN_MEMBERS: null }); //`MANAGE_CHANNELS`, `MANAGE_ROLES`, `MOVE_MEMBERS`, `MUTE_MEMBERS`, `PRIORITY_SPEAKER`, `SPEAK`, `STREAM`, `VIEW_CHANNEL`, `DEAFEN_MEMBERS`
						let embed = new Discord.MessageEmbed()
							.setColor('#fffb00')
							.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
							.setDescription(`<a:tak:767605532450095115> **|** Dodano użytkownika ${member} do kanały prywatnego!`)
						embed.setTimestamp(message.createdAt);
						embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
						return message.channel.send(embed);
					} else {
						let embed = new Discord.MessageEmbed()
							.setColor('#fffb00')
							.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
							.setDescription(`<:nie:767387690248437840> **|** Nie posiadasz własnego kanału prywatnego`)
						embed.setTimestamp(message.createdAt);
						embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
						return message.channel.send(embed);
					}
				} else {
					let embed = new Discord.MessageEmbed()
						.setColor('#fffb00')
						.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
						.setDescription(`<:nie:767387690248437840> **|** Musisz oznaczyć użytkownika lub podać jego ID!`)
					embed.setTimestamp(message.createdAt);
					embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
					return message.channel.send(embed);
				}
			} if (latinize(args[0]).toLowerCase() == `odblokuj`) {
				if (qdb.get(`kanalID_${guild.id}_${message.author.id}`)) {
					let kanal = guild.channels.cache.get(qdb.get(`kanalID_${guild.id}_${message.author.id}`))
					kanal.edit({
						permissionOverwrites: [
							{
								id: guild.id,
								allow: ['VIEW_CHANNEL', `CONNECT`],
							},
							{
								id: message.author.id,
								allow: [`CONNECT`, `MOVE_MEMBERS`, `MUTE_MEMBERS`, `PRIORITY_SPEAKER`, `SPEAK`, `STREAM`, `VIEW_CHANNEL`, `DEAFEN_MEMBERS`],
							},
						]
					})
					let embed = new Discord.MessageEmbed()
						.setColor('#fffb00')
						.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
						.setDescription(`<a:tak:767605532450095115> **|** Odblokowano prywatny kanał`)
					embed.setTimestamp(message.createdAt);
					embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
					return message.channel.send(embed);
				} else {
					let embed = new Discord.MessageEmbed()
						.setColor('#fffb00')
						.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
						.setDescription(`<:nie:767387690248437840> **|** Nie posiadasz własnego kanału prywatnego`)
					embed.setTimestamp(message.createdAt);
					embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
					return message.channel.send(embed);
				}
			} if (latinize(args[0]).toLowerCase() == `permisje`) {
				if (args[1] == `dodaj`) {
					let member = message.mentions.members.first() || message.guild.members.cache.get(args[2])
					if (member) {
						if (member.id == message.author.id) {
							let embed = new Discord.MessageEmbed()
								.setColor('#fffb00')
								.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
								.setDescription(`<:nie:767387690248437840> **|** Nie możesz dać permisji tej osobie`)
							return message.channel.send(embed);
						}
						if (qdb.get(`kanalID_${guild.id}_${message.author.id}`)) {
							let kanal = guild.channels.cache.get(qdb.get(`kanalID_${guild.id}_${message.author.id}`))
							kanal.updateOverwrite(member, { VIEW_CHANNEL: true, CONNECT: true, MANAGE_ROLES: true, MOVE_MEMBERS: true, MUTE_MEMBERS: true, PRIORITY_SPEAKER: true, SPEAK: true, STREAM: true, DEAFEN_MEMBERS: true }); //`MANAGE_CHANNELS`, `MANAGE_ROLES`, `MOVE_MEMBERS`, `MUTE_MEMBERS`, `PRIORITY_SPEAKER`, `SPEAK`, `STREAM`, `VIEW_CHANNEL`, `DEAFEN_MEMBERS`
							let embed = new Discord.MessageEmbed()
								.setColor('#fffb00')
								.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
								.setDescription(`<a:tak:767605532450095115> **|** Dodano permisje użytkownikowi ${member}`)
							return message.channel.send(embed);
						} else {
							let embed = new Discord.MessageEmbed()
								.setColor('#fffb00')
								.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
								.setDescription(`<:nie:767387690248437840> **|** Nie posiadasz własnego kanału prywatnego `)
							return message.channel.send(embed);
						}
					} else {
						let embed = new Discord.MessageEmbed()
							.setColor('#fffb00')
							.setAuthor('Czilerka',)
							.setDescription(`<:nie:767387690248437840> **|** Nie możesz dać permisji tej osobie`)
						return message.channel.send(embed);
					}

				} if (args[1] == `zabierz`) {
					if (!args[2]) {
						let embed = new Discord.MessageEmbed()
							.setColor('#fffb00')
							.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
							.setDescription(`<:nie:767387690248437840> **|** Podaj ID lub oznacz osobę, której chcesz zabrać permisje!`)
						return message.channel.send(embed);
					}
					let member = message.mentions.members.first() || message.guild.members.cache.get(args[2])
					if (member) {
						if (member.id == message.author.id) {
							let embed = new Discord.MessageEmbed()
								.setColor('#fffb00')
								.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
								.setDescription(`<:nie:767387690248437840> **|** Nie możesz dać permisji tej osobie!`)
							return message.channel.send(embed);
						}
						if (qdb.get(`kanalID_${guild.id}_${message.author.id}`)) {
							let kanal = guild.channels.cache.get(qdb.get(`kanalID_${guild.id}_${message.author.id}`))
							kanal.updateOverwrite(member, { VIEW_CHANNEL: true, CONNECT: true, MANAGE_ROLES: null, MOVE_MEMBERS: null, MUTE_MEMBERS: null, PRIORITY_SPEAKER: null, SPEAK: null, STREAM: null, DEAFEN_MEMBERS: null }); //`MANAGE_CHANNELS`, `MANAGE_ROLES`, `MOVE_MEMBERS`, `MUTE_MEMBERS`, `PRIORITY_SPEAKER`, `SPEAK`, `STREAM`, `VIEW_CHANNEL`, `DEAFEN_MEMBERS`
							let embed = new Discord.MessageEmbed()
								.setColor('#fffb00')
								.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
								.setDescription(`<a:tak:767605532450095115> **|** Zabrano permisje użytkownikowi ${member}!`)
							return message.channel.send(embed);
						} else {
							let embed = new Discord.MessageEmbed()
								.setColor('#fffb00')
								.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
								.setDescription(`<:nie:767387690248437840> **|** Nie posiadasz własnego kanału prywatnego!`)
							return message.channel.send(embed);
						}
					} else {
						let embed = new Discord.MessageEmbed()
							.setColor('#fffb00')
							.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
							.setDescription(`<:nie:767387690248437840> **|** Nie możesz dać permisji tej osobie`)
						return message.channel.send(embed);
					}
				} else {
					let embed = new Discord.MessageEmbed()
						.setColor('#fffb00')
						.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
						.setDescription(`<:nie:767387690248437840> **|** Permisje dodaj/zabierz`)
					return message.channel.send(embed);
				}
			} if (latinize(args[0]).toLowerCase() == `wyrzuc`) {
				let member = message.mentions.members.first() || message.guild.members.cache.get(args[1])
				if (member) {
					if (member.id == message.author.id) {
						let embed = new Discord.MessageEmbed()
							.setColor('#fffb00')
							.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
							.setDescription(`<:nie:767387690248437840> **|** Nie możesz wyrzucić tej osoby`)
						return message.channel.send(embed);
					}
					if (qdb.get(`kanalID_${guild.id}_${message.member.id}`)) {
						let kanal = guild.channels.cache.find(channel => message.channel.id === qdb.get(`kanalID_${guild.id}_${message.member.id}`))
						//kanal.updateOverwrite(member, { VIEW_CHANNEL: false, CONNECT: false }); //`MANAGE_CHANNELS`, `MANAGE_ROLES`, `MOVE_MEMBERS`, `MUTE_MEMBERS`, `PRIORITY_SPEAKER`, `SPEAK`, `STREAM`, `VIEW_CHANNEL`, `DEAFEN_MEMBERS`
						let embed = new Discord.MessageEmbed()
							.setColor('#fffb00')
							.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
							.setDescription(`<a:tak:767605532450095115> **|** Wyrzucono użytkownika ${member} z kanału prywatnego`)
						embed.setTimestamp(message.createdAt);
						embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))

						const { channele } = member.voice;
						if (!channele) {
							let embed = new Discord.MessageEmbed()
								.setColor('#fffb00')
								.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
								.setDescription(`<:nie:767387690248437840> **|** Ten użytkownik nie jest na twoim kanale głosowym!`)
							return message.channel.send(embed);
						}
						if (message.channel.id == qdb.get(`kanalID_${guild.id}_${message.author.id}`)) {
							message.message.channel.send(embed);
							member.voice.kick();
						} else {
							let embed = new Discord.MessageEmbed()
								.setColor('#fffb00')
								.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
								.setDescription(`<:nie:767387690248437840> **|** Ten użytkownik nie jest na twoim kanale głosowym!`)
							return message.channel.send(embed);
						}
					} else {
						let embed = new Discord.MessageEmbed()
							.setColor('#fffb00')
							.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
							.setDescription(`<:nie:767387690248437840> **|** Nie posiadasz własnego kanału prywatnego`)
						embed.setTimestamp(message.createdAt);
						embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
						return message.channel.send(embed);
					}
				} else {
					let embed = new Discord.MessageEmbed()
						.setColor('#fffb00')
						.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
						.setDescription(`<:nie:767387690248437840> **|** Nie możesz wyrzucić tej osoby`)
					embed.setTimestamp(message.createdAt);
					embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
					return message.channel.send(embed);
				}
			} if (latinize(args[0]).toLowerCase() == `stworz`) {
				if (!message.member.hasPermission(`ADMINISTRATOR`)) {
					let embed = new Discord.MessageEmbed()
						.setColor('#fffb00')
						.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
						.setDescription(`<:nie:767387690248437840> **|** Nie posiadasz uprawnień!`)
						.setTimestamp(message.createdAt)
						.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
					return message.channel.send(embed);
				}
				let member = message.mentions.members.first() || message.guild.members.cache.get(args[1])
				if (member) {
					if (!qdb.get(`kanalID_${guild.id}_${member.id}`)) {

						qdb.set(`kanal_${guild.id}_${member.id}`, true);
						qdb.set(`kanalczas_${guild.id}_${member.id}`, Date.now() + 86400000);
						guild.channels.create(`🔈┇${member.tag}`, {
							type: 'voice',
							parent: '765530588207120444',
							permissionOverwrites: [
								{
									id: message.guild.id,
									deny: ['VIEW_CHANNEL'],
								},
								{
									id: member.id,
									allow: [`CONNECT`, `MOVE_MEMBERS`, `MUTE_MEMBERS`, `PRIORITY_SPEAKER`, `SPEAK`, `STREAM`, `VIEW_CHANNEL`, `DEAFEN_MEMBERS`],
								},
							],
						}).then(vc => {
							qdb.set(`kanalID_${guild.id}_${member.id}`, vc.id);
						})
						let embed = new Discord.MessageEmbed()
							.setColor('#fffb00')
							.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
							.setDescription(`<a:tak:767605532450095115> **|** Stworzono kanał prywatny dla użytkownika ${member}`)
						embed.setTimestamp(message.createdAt);
						embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
						return message.channel.send(embed);
					} else {
						let embed = new Discord.MessageEmbed()
							.setColor('#fffb00')
							.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
							.setDescription(`<:nie:767387690248437840> **|** Ten użytkownik ma już kanał prywatny`)
						embed.setTimestamp(message.createdAt);
						embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
						return message.channel.send(embed);
					}
				} else {
					let embed = new Discord.MessageEmbed()
						.setColor('#fffb00')
						.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
						.setDescription(`<:nie:767387690248437840> **|** Nie znaleziono użytkownika`)
					embed.setTimestamp(message.createdAt);
					embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
					return message.channel.send(embed);
				}
			} if (latinize(args[0]).toLowerCase() == `usun`) {
				if (!message.member.hasPermission(`ADMINISTRATOR`)) {
					let embed = new Discord.MessageEmbed()
						.setColor('#fffb00')
						.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
						.setDescription(`<:nie:767387690248437840> **|** Nie posiadasz uprawnień!`)
						.setTimestamp(message.createdAt)
						.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
					return message.channel.send(embed);
				}
				let member = message.mentions.members.first() || message.guild.members.cache.get(args[1])
				if (qdb.get(`kanalID_${guild.id}_${member.id}`)) {
					kanal = message.guild.channels.cache.get(qdb.get(`kanalID_${guild.id}_${member.id}`))
					if (kanal) kanal.delete()
					qdb.delete(`kanal_${guild.id}_${member.id}`)
					qdb.delete(`kanalID_${guild.id}_${member.id}`)
					qdb.delete(`kanalczas_${guild.id}_${member.id}`)

					let embed = new Discord.MessageEmbed()
						.setColor('#fffb00')
						.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
						.setDescription(`<a:tak:767605532450095115> **|** Usunięto kanał prywatny ${member}`)
					embed.setTimestamp(message.createdAt);
					embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
					return message.channel.send(embed);
				} else {
					let embed = new Discord.MessageEmbed()
						.setColor('#fffb00')
						.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
						.setDescription(`<:nie:767387690248437840> **|** Ten użytkownik nie ma kanału prywatnego`)
					embed.setTimestamp(message.createdAt);
					embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
					return message.channel.send(embed);
				}
			}
		}
	}
};