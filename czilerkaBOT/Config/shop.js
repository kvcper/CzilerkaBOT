const lang = require("./lang");
const qdb = require('quick.db');
const ceny = require("./ceny.json");
const Discord = require("discord.js");
const fs = require("fs");
const levels = JSON.parse(fs.readFileSync("./Config/levele.json", "utf8"));
const rangi = JSON.parse(fs.readFileSync("./Config/rangi.json", "utf8"));
const rangivc = JSON.parse(fs.readFileSync("./Config/rangivc.json", "utf8"));

const configID = JSON.parse(fs.readFileSync("./Config/configID.json", "utf8"));

function wyslij(member, item, cena, guild) {
	kanal = guild.channels.cache.find(channel => channel.id === `800504919311908864`)
	let embedzik = new Discord.MessageEmbed()
		.setColor('#fffb00')
		.setAuthor('Czilerka Ekonomia', 'https://images-ext-1.discordapp.net/external/ll0HOsBt_sjpFMp3_NaPz6O3uVzG9R0bkXjBHqHlvPg/%3Fsize%3D4096/https/cdn.discordapp.com/avatars/764059875537321984/0201c677459073f66aeaa9ece3157049.png?width=475&height=475')
		.setDescription(`Użytkownik ${member} zakupił ${item} za ${cena}`)
		.setTimestamp()
	kanal.send(embedzik)
}

const levele = new qdb.table('levele')

async function rolinio(nowarola, stararola, user, guild) {
	const mMember = user.member || guild.members.cache.get(user.id)
	let nowarolacheck = guild.roles.cache.find(x => x.id == nowarola.id);
	await mMember.roles.add(nowarolacheck.id);
}

async function lvlcheck(client, guild, user, levelez, daliexp, levelObj) {
	if (daliexp >= levele[levelez + 1] && levelez != 150) {
		daliexp = daliexp - levele[levelez + 1];
		levelez = levelez + 1;
		lvlcheck(client, guild, user, levelez, daliexp, levelObj);
	} else {
		if(levelObj.level != levelez){
			let kanal = guild.channels.cache.get(configID.levelupChannelID)
			kanal.send(`Gratulacje ${user}! Osiągnięto poziom tekstowy ${levelez}!`)
		}
		levelObj.level = levelez;
		levelObj.TextXP = daliexp;
		levelObj.ReqTextXP = levele[levelez + 1];
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
	if (daliexp >= levele[levelez + 1] && levelez != 150) {
		daliexp = daliexp - levele[levelez + 1];
		levelez = levelez + 1;
		lvlcheckvc(client, guild, user, levelez, daliexp, levelObj);
	} else {
		if(levelObj.levelVC != levelez){
			let kanal = guild.channels.cache.get(configID.levelupChannelID)
			kanal.send(`Gratulacje ${user}! Osiągnięto poziom głosowy ${levelez}!`)
		}
		levelObj.levelVC = levelez;
		levelObj.VCXP = daliexp;
		levelObj.ReqVCXP = levele[levelez + 1];
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

module.exports = [
	{
		id: "nick",
		name: "nick",
		description: "**Opis:** Jednorazowa zmiana nicku\n`-` Aby zakupić zmiane nicku, wpisz **`$kup nick <twój nick>`**",
		price: 600,
		onBuy: async function ({ args, member, memberDoc, guild, name, price }) {
			if (qdb.fetch(`money_${guild.id}_${member.id}`) < ceny.cena.nick) throw `<:nie:767387690248437840> **|** Nie posiadasz <a:czokobonsy:767191684458872843>${ceny.cena.nick} aby zakupić nick`
			let nickname = args.join(" ");
			if (!nickname) {
				throw lang.shop.Zmiana_Nicku.noNickname;
			}
			member.setNickname(nickname).then(() => { }).catch((error) => {
				if (String(error) == "DiscordAPIError: Missing Permissions") {
					qdb.add(`money_${guild.id}_${member.id}`, ceny.cena.nick)
					throw lang.shop.Zmiana_Nicku.noPermission;
				}
				else {
					qdb.add(`money_${guild.id}_${member.id}`, ceny.cena.nick)
					throw lang.unknownError;
				}
			});
			qdb.subtract(`money_${guild.id}_${member.id}`, ceny.cena.nick)
			wyslij(member, `Zmianę nicku`, ceny.cena.nick, guild)
			throw `<a:tak:767605532450095115> **|** Zakupiono nick **${nickname}** za <a:czokobonsy:767191684458872843>${ceny.cena.nick}`
		},
	},
	{
		id: "unwarn",
		name: "Unwarn",
		description: "**Opis:** Jednorazowe usunięcie warna\n`-` Aby zakupić un warna, wpisz **`$kup unwarn <ID warna>`**",
		price: 7000,
		onBuy: async function ({ args, member, memberDoc, guild }) {
			if (qdb.fetch(`money_${guild.id}_${member.id}`) < ceny.cena.unwarn) throw `<:nie:767387690248437840> **|** Nie posiadasz <a:czokobonsy:767191684458872843>${ceny.cena.unwarn} aby zakupić unwarn'a`
			let warns = qdb.get(`warnings_${guild.id}`)
			let id = parseInt(args[0])
			if (warns === null || warns.length < 1) return
			let warnFind = warns.filter(w => w != null)
			let finalWarn = warnFind.find(w => w.id === id)
			if (!finalWarn) return
			const index = warnFind.findIndex(w => w.id == id)
			warns.splice(index, 1)
			qdb.set(`warnings_${guild.id}`, warns)
			qdb.subtract(`money_${guild.id}_${member.id}`, ceny.cena.unwarn)
			throw `<a:tak:767605532450095115> **|** Zakupiono **Unwarn'a** za <a:czokobonsy:767191684458872843>${ceny.cena.unwarn}`
		},
	},
	{
		id: "kolor",
		name: "Kolor",
		description: "**Opis:** Kolor nicku na 30 dni\n`-` Aby zakupić kolor, wpisz **`$kup kolor <Nazwe koloru>`**",
		price: 10000,
		validityTime: 2592000000,
		onBuy: async function ({ args, member, memberDoc, guild, name, price }) {
			let color = args.join(" ").toLowerCase();
			if (!color) throw lang.shop.Kolor.noColor;
			let cena
			if (color == "losowy") {
				color = colors[Math.floor(Math.random() * colors.length)];
				cena = 9000
			} else cena = 10000
			if (qdb.fetch(`money_${guild.id}_${member.id}`) < cena) throw `<:nie:767387690248437840> **|** Nie posiadasz <a:czokobonsy:767191684458872843>${cena} aby zakupić kolor`
			else if (!colors.includes(color)) {
				throw lang.shop.Kolor.colorNotFound;
			}
			let role = (await guild.roles.fetch()).cache.find((role) => (role.name.toLowerCase() == color));
			if (!role) {
				throw lang.shop.Kolor.colorRoleNotFound;
			}

			if (member.roles.cache.has(role.id)) {
				throw lang.alreadyHave
			}

			const roles = member.roles.cache
				.forEach((rola) => {
					if (colors.includes(rola.name.toLowerCase())) {
						member.roles.remove(rola)
					}
				})
			qdb.subtract(`money_${guild.id}_${member.id}`, cena)
			member.roles.add(role)
			wyslij(member, `Kolor ${role}`, cena, guild)
			throw `<a:tak:767605532450095115> **|** Zakupiono kolor ${role} na 30 dni za <a:czokobonsy:767191684458872843>${cena}`
		},
		onExpire: function ({ itemDoc, member }) {
			member.roles.remove(itemDoc.roleId);
		},
	},
	{
		id: "farmaKokosow",
		name: "farma",
		description: "**Opis:** Farma kokosów na 30 dni daje 500 $ co 24h\n`-` Aby zakupić farme, wpisz **`$kup farma`**",
		price: 9000,
		validityTime: 2592000000,
		onBuy: async function ({ args, member, guild, memberDoc, name, price }) {
			if (qdb.fetch(`money_${guild.id}_${member.id}`) < ceny.cena.farma) throw `<:nie:767387690248437840> **|** Nie posiadasz <a:czokobonsy:767191684458872843>${ceny.cena.farma} aby zakupić farmę kokosów`
			if (qdb.fetch(`farma_${guild.id}_${member.id}`)) throw `<:nie:767387690248437840> **|** Posiadasz już Farmę Kokosów`
			qdb.subtract(`money_${guild.id}_${member.id}`, ceny.cena.farma)
			qdb.set(`farma_${guild.id}_${member.id}`, Date.now() + 2592000000)
			qdb.set(`farmaodbierz_${guild.id}_${member.id}`, Date.now() + 86400000)
			wyslij(member, `Farmę Kokosów`, ceny.cena.farma, guild)
			throw `<a:tak:767605532450095115> **|** Zakupiono **Farmę Kokosów** za <a:czokobonsy:767191684458872843>${ceny.cena.farma}`
		},
	},
	{
		id: "vip",
		name: "VIP",
		description: "**Opis:** Ranga VIP na 30 dni\n`-` Aby zakupić VIPA, wpisz **`$kup vip`**",
		price: 13000,
		onBuy: async function ({ args, member, guild, memberDoc, guildConfig, name, price }) {
			if (qdb.fetch(`money_${guild.id}_${member.id}`) < ceny.cena.vip) throw `<:nie:767387690248437840> **|** Nie posiadasz <a:czokobonsy:767191684458872843>${ceny.cena.vip} aby zakupić <:vip:772856948269908048> VIP'a na 30 dni`
			if (member.roles.cache.has(guildConfig.vipRoleId)) throw lang.alreadyHave;
			qdb.subtract(`money_${guild.id}_${member.id}`, ceny.cena.vip)
			member.roles.add(guildConfig.vipRoleId)
			qdb.set(`vipkoniec_${guild.id}_${member.id}`, Date.now() + 2592000000) //2592000000
			wyslij(member, `Vip`, ceny.cena.vip, guild)
			throw `<:vip:772856948269908048> **|** Gratuluje! Właśnie zakupiłeś **VIP\`a** na 30dni za ${ceny.cena.vip} <a:czokobonsy:767191684458872843>\n**\`- Ważność twojego vipa sprawdzisz pod komendą: !status vip\`**`
		},
	},
	{
		id: "emoji",
		name: "Emoji",
		description: "**Opis:** Rola Emoji\n`-` Aby zakupić role Emoji, wpisz **`$kup Emoji`**",
		price: 13000,
		onBuy: async function ({ args, member, guild, memberDoc, guildConfig, name, price }) {
			if (qdb.fetch(`money_${guild.id}_${member.id}`) < ceny.cena.emoji) throw `<:nie:767387690248437840> **|** Nie posiadasz <a:czokobonsy:767191684458872843>${ceny.cena.emoji} aby zakupić role Emoji`
			if (member.roles.cache.has(guildConfig.emojiRoleId)) throw lang.alreadyHave;
			qdb.subtract(`money_${guild.id}_${member.id}`, ceny.cena.emoji)
			member.roles.add(guildConfig.emojiRoleId)
			wyslij(member, `Emoji`, ceny.cena.emoji, guild)
			throw `<:vip:772856948269908048> **|** Gratuluje! Właśnie zakupiłeś **role Emoji** za ${ceny.cena.emoji} <a:czokobonsy:767191684458872843>`
		},
	},
	{
		id: "kocur",
		name: "Kocur",
		description: "**Opis:** Rola Kocur\n`-` Aby zakupić role Kocur, wpisz **`$kup Kocur`**",
		price: 13000,
		onBuy: async function ({ args, member, guild, memberDoc, guildConfig, name, price }) {
			if (qdb.fetch(`money_${guild.id}_${member.id}`) < ceny.cena.kocur) throw `<:nie:767387690248437840> **|** Nie posiadasz <a:czokobonsy:767191684458872843>${ceny.cena.kocur} aby zakupić role Kocur`
			if (member.roles.cache.has(guildConfig.kocurRoleId)) throw lang.alreadyHave;
			qdb.subtract(`money_${guild.id}_${member.id}`, ceny.cena.kocur)
			member.roles.add(guildConfig.kocurRoleId)
			wyslij(member, `Kocur`, ceny.cena.kocur, guild)
			throw `<:vip:772856948269908048> **|** Gratuluje! Właśnie zakupiłeś **role Kocur** za ${ceny.cena.kocur} <a:czokobonsy:767191684458872843>`
		},
	},
	{
		id: "vipPremium",
		name: "premium",
		description: "**Opis:** Ranga PREMIUM VIP na 30 dni\n`-` Aby zakupić PREMIUM VIPA, wpisz **`$kup PREMIUM VIP`**",
		onBuy: async function ({ args, guild, member, memberDoc, guildConfig, name, price }) {
			if (qdb.fetch(`money_${guild.id}_${member.id}`) < ceny.cena.premium) throw `<:nie:767387690248437840> **|** Nie posiadasz <a:czokobonsy:767191684458872843>${ceny.cena.premium} aby zakupić VIP'a Premium na 30 dni`
			if (member.roles.cache.has(guildConfig.vipPremiumRoleId)) {
				throw lang.alreadyHave;
			}
			qdb.subtract(`money_${guild.id}_${member.id}`, ceny.cena.premium)
			member.roles.add(guildConfig.vipPremiumRoleId)
			qdb.set(`premiumvipkoniec_${guild.id}_${member.id}`, Date.now() + 2592000000) //2592000000
			wyslij(member, `Premium Vip`, ceny.cena.premium, guild)
			throw `<a:tak:767605532450095115> **|** Zakupiono **VIP'a Premium** na 30 dni za <a:czokobonsy:767191684458872843>${ceny.cena.premium}`
		},
	},
	{
		id: "rola",
		name: "rola",
		description: "**Opis:** customowa rola",
		price: 10000,
		onBuy: async function ({ args, member, guild, memberDoc, guildConfig, name, price }) {
			if (qdb.fetch(`money_${guild.id}_${member.id}`) < ceny.cena.role) throw `<:nie:767387690248437840> **|** Nie posiadasz <a:czokobonsy:767191684458872843>${ceny.cena.role} aby zakupić rolę`
			let rola = args.join(" ").toLowerCase();
			if (!rola) throw `<:nie:767387690248437840> **|** Nie podano nazwy roli`

			guild.roles.create({
				data: {
					name: rola,
				},
			})
				.then((role) => {
					member.roles.add(role)
				})
			qdb.subtract(`money_${guild.id}_${member.id}`, ceny.cena.role)
			wyslij(member, `Rolę`, ceny.cena.role, guild)
			throw `<a:tak:767605532450095115> **|** Zakupiono rolę **${rola}** za <a:czokobonsy:767191684458872843>${ceny.cena.role}`
		},
	},
	{
		id: "kanał",
		name: "Kanał",
		description: `Wynajmując własny kanał głosowy masz możliwość pogadania z swoimi znajomymi gdzie ty ustalasz z kim gadasz i ty ustawiasz premisje kanału!
		Cennik: 24h - 3,000
		7 dni - 20,000
		30 dni 80,000`,
		onBuy: async function ({ args, member, guild, memberDoc, guildConfig, name }) {
			let rodzaj = args.join(" ").toLowerCase();
			if (!rodzaj) throw `<:nie:767387690248437840> **|** Nie podano czasu na jaki chcesz kupić kanał prywatny (24h/7d/30d)`
			if (rodzaj == "24h") {
				if (qdb.fetch(`money_${guild.id}_${member.id}`) < ceny.cena.kanal24) throw `<:nie:767387690248437840> **|** Nie posiadasz <a:czokobonsy:767191684458872843>${ceny.cena.kanal24} aby zakupić kanał prywatny na 24 godziny`

				let kanal = qdb.fetch(`kanal_${guild.id}_${member.id}`);
				if (!kanal) {
					qdb.set(`kanal_${guild.id}_${member.id}`, true);
					qdb.set(`kanalczas_${guild.id}_${member.id}`, Date.now() + 86400000);
				} else throw "Juz posiadasz kanał prywatny"
				qdb.subtract(`money_${guild.id}_${member.id}`, ceny.cena.kanal24)
				guild.channels.create(`🔈┇${member.user.tag}`, {
					type: 'voice',
					parent: '800504850144034836',
					permissionOverwrites: [
						{
							id: guild.id,
							deny: ['VIEW_CHANNEL'],
						},
						{
							id: member.user.id,
							allow: [`CONNECT`, `MOVE_MEMBERS`, `MUTE_MEMBERS`, `PRIORITY_SPEAKER`, `SPEAK`, `STREAM`, `VIEW_CHANNEL`, `DEAFEN_MEMBERS`],
						},
					],
				}).then(vc => {
					qdb.set(`kanalID_${guild.id}_${member.id}`, vc.id);
				})
				wyslij(member, `Kanał Prywatny (24H)`, ceny.cena.kanal24, guild)
				throw `<a:tak:767605532450095115> **|** Zakupiono **Kanał Prywatny** na 24 godziny za <a:czokobonsy:767191684458872843>${ceny.cena.kanal24}`
			}
			if (rodzaj == "7d") {
				if (qdb.fetch(`money_${guild.id}_${member.id}`) < ceny.cena.kanal7) throw `<:nie:767387690248437840> **|** Nie posiadasz <a:czokobonsy:767191684458872843>${ceny.cena.kanal7} aby zakupić kanał prywatny na 7 dni`
				let kanal = qdb.fetch(`kanal_${guild.id}_${member.id}`);
				if (!kanal) {
					qdb.set(`kanal_${guild.id}_${member.id}`, true);
					qdb.set(`kanalczas_${guild.id}_${member.id}`, Date.now() + 604800000);
				} else throw "Juz posiadasz kanał prywatny"
				qdb.subtract(`money_${guild.id}_${member.id}`, ceny.cena.kanal7)
				guild.channels.create(`🔈┇${member.user.tag}`, {
					type: 'voice',
					parent: '800504850144034836',
					permissionOverwrites: [
						{
							id: guild.id,
							deny: ['VIEW_CHANNEL'],
						},
						{
							id: member.user.id,
							allow: [`CONNECT`, `MOVE_MEMBERS`, `MUTE_MEMBERS`, `PRIORITY_SPEAKER`, `SPEAK`, `STREAM`, `VIEW_CHANNEL`, `DEAFEN_MEMBERS`],
						},
					],
				}).then(vc => {
					qdb.set(`kanalID_${guild.id}_${member.id}`, vc.id);
				})
				wyslij(member, `Kanał Prywatny (7D)`, ceny.cena.kanal7, guild)
				throw `<a:tak:767605532450095115> **|** Zakupiono **Kanał Prywatny** na 7 dni za <a:czokobonsy:767191684458872843>${ceny.cena.kanal7}`
			}
			if (rodzaj == "30d") {
				if (qdb.fetch(`money_${guild.id}_${member.id}`) < ceny.cena.kanal30) throw `<:nie:767387690248437840> **|** Nie posiadasz <a:czokobonsy:767191684458872843>${ceny.cena.kanal30} aby zakupić kanał prywatny na 30 dni`
				let kanal = qdb.fetch(`kanal_${guild.id}_${member.id}`);
				if (!kanal) {
					qdb.set(`kanal_${guild.id}_${member.id}`, true);
					qdb.set(`kanalczas_${guild.id}_${member.id}`, Date.now() + 2592000000);
				} else throw "Juz posiadasz kanał prywatny"
				qdb.subtract(`money_${guild.id}_${member.id}`, ceny.cena.kanal30)
				guild.channels.create(`🔈┇${member.user.tag}`, {
					type: 'voice',
					parent: '800504850144034836',
					permissionOverwrites: [
						{
							id: guild.id,
							deny: ['VIEW_CHANNEL'],
						},
						{
							id: member.user.id,
							allow: [`CONNECT`, `MOVE_MEMBERS`, `MUTE_MEMBERS`, `PRIORITY_SPEAKER`, `SPEAK`, `STREAM`, `VIEW_CHANNEL`, `DEAFEN_MEMBERS`],
						},
					],
				}).then(vc => {
					qdb.set(`kanalID_${guild.id}_${member.id}`, vc.id);
				})
				wyslij(member, `Kanał Prywatny (30D)`, ceny.cena.kanal30, guild)
				throw `<a:tak:767605532450095115> **|** Zakupiono **Kanał Prywatny** na 30 dni za <a:czokobonsy:767191684458872843>${ceny.cena.kanal30}`
			} else throw `<:nie:767387690248437840> **|** Nie podano czasu na jaki chcesz kupić kanał prywatny (24h/7d/30d)`
		},
		onExpire: function ({ itemDoc, member, kanal }) {
			kanal.delete()
		},
	},
	{
		id: "exp50000",
		name: "50k",
		description: "**Opis:** Dostajesz jednorazowo 100 tysięcy expa\n`-` Aby zakupić 50k EXPA, wpisz **`$kup 50k EXPA`**",
		onBuy: async function ({ args, guild, member, memberDoc, name, price, client }) {
			if (args[0] == `voice` || args[0] == `głosowy` || args[0] == `glosowy` || args[0] == `vc`) {
				if (qdb.fetch(`money_${guild.id}_${member.id}`) < ceny.cena.exp) throw `<:nie:767387690248437840> **|** Nie posiadasz <a:czokobonsy:767191684458872843>${ceny.cena.exp} aby zakupić 100 tysięcy EXP'a`
				qdb.subtract(`money_${guild.id}_${member.id}`, ceny.cena.exp)

				let levelObj = levele.get(`level_${member.guild.id}_${member.id}`);
				if (!levelObj) {
					levelObj = {
						level: 0,
						TextXP: 0,
						ReqTextXP: levele[1],
						levelVC: 0,
						VCXP: 0,
						ReqVCXP: levele[1],
						rep: 0
					};
					levele.set(`level_${member.guild.id}_${member.id}`, levelObj);
					levelObj = db.get(`level_${member.guild.id}_${member.id}`);
					levele.set(`GlobalTextXP_${member.guild.id}_${member.id}`, 0);
					levele.set(`GlobalVCXP_${member.guild.id}_${member.id}`, 0);
				}
				let i = 50000
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
				levele.add(`GlobalVCXP_${member.guild.id}_${member.id}`, 50000)

				wyslij(member, `50k EXP`, ceny.cena.exp, guild)
				throw `<a:tak:767605532450095115> **|** Zakupiono **50 Tysięcy EXP'a** za <a:czokobonsy:767191684458872843>${ceny.cena.exp}`
			} if (args[0] == `chat` || args[0] == `tekstowe` || args[0] == `tekstowy` || args[0] == `text`) {
				if (qdb.fetch(`money_${guild.id}_${member.id}`) < ceny.cena.exp) throw `<:nie:767387690248437840> **|** Nie posiadasz <a:czokobonsy:767191684458872843>${ceny.cena.exp} aby zakupić 50 tysięcy EXP'a`
				qdb.subtract(`money_${guild.id}_${member.id}`, ceny.cena.exp)

				let levelObj = levele.get(`level_${member.guild.id}_${member.id}`);
				if (!levelObj) {
					levelObj = {
						level: 0,
						TextXP: 0,
						ReqTextXP: levels[1],
						levelVC: 0,
						VCXP: 0,
						ReqVCXP: levels[1],
						rep: 0
					};
					levele.set(`level_${member.guild.id}_${member.id}`, levelObj);
					levelObj = db.get(`level_${member.guild.id}_${member.id}`);
					levele.set(`GlobalTextXP_${member.guild.id}_${member.id}`, 0);
					levele.set(`GlobalVCXP_${member.guild.id}_${member.id}`, 0);
				}
				let i = 50000
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
				levele.add(`GlobalTextXP_${member.guild.id}_${member.id}`, 50000)

				wyslij(member, `50K EXP`, ceny.cena.exp, guild)
				throw `<a:tak:767605532450095115> **|** Zakupiono **50 Tysięcy EXP'a** za <a:czokobonsy:767191684458872843>${ceny.cena.exp}`
				//dodaje exp
			} throw `<:nie:767387690248437840> **|** Nie ma takiej komendy.`
		},
	},
].reduce((shop, shopItem) => {
	shop[shopItem.id] = shopItem;
	return shop;
}, {});