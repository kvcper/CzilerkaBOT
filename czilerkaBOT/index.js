const { Client, Collection } = require("discord.js");
const Discord = require("discord.js");
const db = require("quick.db");
const fs = require("fs")
const { default_prefix } = require('./secret/config.json');
const client = new Client({
	disableEveryone: true,
	partials: ["MESSAGE", "REACTION"]
});
global.shop = require("./Config/shop.js");
global.lang = require("./Config/lang.js");
global.removeNonNumericCharacters = (text) => (text.replace(/\D/g, ''));
global.addItemDoc = (doc) => (db.items[doc.id] = doc);
global.colors = require("./Config/colors.json");

const levels = JSON.parse(fs.readFileSync("./Config/levele.json", "utf8"));
const rangi = JSON.parse(fs.readFileSync("./Config/rangi.json", "utf8"));
const rangivc = JSON.parse(fs.readFileSync("./Config/rangivc.json", "utf8"));

const latinize = require(`latinize`)

const levele = new db.table('levele')

const configID = JSON.parse(fs.readFileSync("./Config/configID.json", "utf8"));

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const Mutes = require("./models/mutes.js");
const Mutesvc = require("./models/mutesvc.js");

client.commands = new Collection();
client.aliases = new Collection();
client.queue = new Map();
["commands"].forEach(async handler => {
	require(`./handlers/${handler}`)(client);
});

client.on('ready', async () => {
	console.log(` [Ready] Bot został włączony`)
	client.user.setActivity(`Discord.gg/czilerka`, { type: 'STREAMING' })
})

// ################## SKARGI #################### //

client.on("message", async message => {
	if (message.author.bot) return;
	if (!message.guild) return;
	if (message.channel.id == configID.ogloszeniaID) {
		await message.react(`<:like:773589080260870164>`)
		await message.react(`<:superka:773589060086136832>`)
		await message.react(`<:wow:773589093803229227>`)
	}
	const guildConfig = require(`./Config/config.json`)
	if (guildConfig) {
		if (message.author.bot) return
		db.set(`kasa_${message.guild.id}_${message.author.id}`, (db.fetch(`money_${message.guild.id}_${message.author.id}`) ? db.fetch(`money_${message.guild.id}_${message.author.id}`) : 0) + (db.fetch(`bank_${message.guild.id}_${message.author.id}`)) ? db.fetch(`money_${message.guild.id}_${message.author.id}`) : 0)

		let prefix = db.get(`prefix_${message.guild.id}`)
		if (!prefix) prefix = default_prefix
		//if (message.mentions.users.first() === client.user) return message.channel.send("Mój prefix to " + prefix)
		if (message.content.startsWith(prefix)) {
			if (!message.member) message.member = await message.guild.fetchMember(message);
			const args = message.content.slice(prefix.length).trim().split(/ +/g);
			const cmd = args.shift().toLowerCase();
			if (cmd.length === 0) return;
			let command = client.commands.get(cmd);
			if (!command) command = client.commands.get(client.aliases.get(cmd));
			if (command) {
				command.run(client, message, args);
			}
		}
		if (Date.now() - db.fetch(`lastmess_${message.guild.id}_${message.author.id}`) >= 30000) { // 30 s cooldown
			let money = db.fetch(`money_${message.guild.id}_${message.author.id}`);
			if (!money) {
				db.set(`money_${message.guild.id}_${message.author.id}`, 0);
			} db.add(`money_${message.guild.id}_${message.author.id}`, 2)
			let lastmess = db.fetch(`lastmess_${message.guild.id}_${message.author.id}`);
			if (!lastmess) {
				return db.set(`lastmess_${message.guild.id}_${message.author.id}`, Date.now());
			} return db.set(`lastmess_${message.guild.id}_${message.author.id}`, Date.now())
		} else return
	}
});

// ############ HANDLER ############## //

async function skarga(nadawca, odbiorca, odpowiedz, pliki, serwer) {
	if (odpowiedz == `tak`) {
		let embed = new Discord.MessageEmbed()
			.setAuthor('Czilerka', client.user.avatarURL())
			.setTitle(`Skarga`)
			.setColor("YELLOW")
			.setDescription(`Załącz plik poniżej!`)
		nadawca.send(embed)
		let channel = nadawca.dmChannel;
		if (!channel) channel = await nadawca.createDM();

		let responses = await channel.awaitMessages(
			msg => msg.author.id === nadawca.id,
			{ time: 300000, max: 1 }
		);

		let answer = responses.first().attachments.array()[0]
		let nameArray = answer.name.split('/'); //Split the name 
		let attEx = nameArray[nameArray.length - 1] //Grap the last value of the array.
		if (!pliki) pliki = ""
		pliki += `\n[${attEx}](${answer.url})`
		embed = new Discord.MessageEmbed()
			.setAuthor('Czilerka', client.user.avatarURL())
			.setTitle(`Skarga`)
			.setColor("YELLOW")
			.setDescription(`Wpisz **Stop** aby przerwać proces skargi! 
			Czy chcesz załączyć kolejne dowody? Wpisz **tak** lub **nie**`)
		nadawca.send(embed)

		responses = await channel.awaitMessages(
			msg => msg.author.id === nadawca.id,
			{ time: 300000, max: 1 }
		);
		let answer3 = responses.first().content

		return skarga(nadawca, odbiorca, answer3, pliki, serwer)
	} if (odpowiedz == `nie`) {
		let embed = new Discord.MessageEmbed()
			.setAuthor('Czilerka', client.user.avatarURL())
			.setTitle(`Skarga`)
			.setColor("YELLOW")
			.setDescription(`Podaj treść swojego zgłoszenia!`)
		nadawca.send(embed)

		let channel = nadawca.dmChannel;
		if (!channel) channel = await nadawca.createDM();

		responses = await channel.awaitMessages(
			msg => msg.author.id === nadawca.id,
			{ time: 300000, max: 1 }
		);
		let answer2 = responses.first().content

		embed = new Discord.MessageEmbed()
			.setAuthor('Czilerka', client.user.avatarURL())
			.setTitle(`Skarga`)
			.setColor("YELLOW")
			.setDescription(`
Nadawca: ${nadawca}
Odbiorca: ${odbiorca}
Pliki: ${pliki ? pliki : `Brak`}
Treść: ${answer2}`)
		let gld = client.guilds.cache.get(serwer)
		let kanal = gld.channels.cache.get(configID.skargaAdmID)
		if (kanal) kanal.send(embed)
		return nadawca.send(embed)
	} if (odpowiedz == `stop`) {
		let embed = new Discord.MessageEmbed()
			.setAuthor('Czilerka', client.user.avatarURL())
			.setTitle(`Skarga`)
			.setColor("YELLOW")
			.setDescription(`Anulowano skargę!`)
		return nadawca.send(embed)
	} else {
		let embed = new Discord.MessageEmbed()
			.setAuthor('Czilerka', client.user.avatarURL())
			.setTitle(`Skarga`)
			.setColor("YELLOW")
			.setDescription(`Podano zły argument! Wpisz **Stop** aby przerwać proces w dowolnym momencie!\nChcesz załączyć pliki do skargi? Wpisz **tak** lub **nie**`)
		nadawca.send(embed)

		let channel = nadawca.dmChannel;
		if (!channel) channel = await nadawca.createDM();

		let responses = await channel.awaitMessages(
			msg => msg.author.id === nadawca.id,
			{ time: 300000, max: 1 }
		);
		return skarga(nadawca, odbiorca, responses, pliki, serwer)
	}
}

client.on("message", async message => {
	if (message.guild && !message.author.bot) {
		if (message.channel.id == configID.skargaID) {
			let pliki = ""
			let member = message.mentions.members.first()
			if (!member) return message.delete()
			message.delete()
			let embed = new Discord.MessageEmbed()
				.setAuthor('Czilerka', client.user.avatarURL())
				.setTitle(`Skarga`)
				.setColor("YELLOW")
				.setDescription(`Wpisz **Stop** aby przerwać proces w dowolnym momencie!\nChcesz załączyć pliki do skargi? Wpisz **tak** lub **nie**`)
			message.member.send(embed)

			let channel = message.author.dmChannel;
			if (!channel) channel = await message.author.createDM();

			let responses = await channel.awaitMessages(
				msg => msg.author.id === message.author.id,
				{ time: 300000, max: 1 }
			);
			let answer1 = responses.first().content

			return skarga(message.author, member, answer1, pliki, message.guild.id)
		}
		if (db.get(`slubtime_${message.guild.id}_${message.member.id}`)) {
			if (latinize(message.content).toLowerCase() == `zgadzam sie`) {
				let member = db.get(`slubtime_${message.guild.id}_${message.author.id}`)
				db.delete(`slubtime_${message.guild.id}_${message.author.id}`)
				let slub1 = {
					poslubiony: member
				}
				let slub2 = {
					poslubiony: message.member.id
				}
				db.set(`slub_${message.guild.id}_${message.author.id}`, slub1)
				db.set(`slub_${message.guild.id}_${member}`, slub2)
				let embed = new Discord.MessageEmbed()
					.setAuthor('Czilerka', client.user.avatarURL())
					.setTitle(`No i poślubieni!`)
					.setColor("ff6fe7")
					.setDescription(`Kiedy zaprosicie mnie na wesele? Wypije za wasze zdrowie!`)
				return message.channel.send(embed)
			}
		}
	}
})

//################# REPORTY ####################//

async function report(nadawca, odbiorca, odpowiedz, pliki, serwer) {
	if (odpowiedz == `tak`) {
		let embed = new Discord.MessageEmbed()
			.setAuthor('Czilerka', client.user.avatarURL())
			.setTitle(`Report`)
			.setColor("#ff4d00")
			.setDescription(`Załącz plik poniżej!`)
		nadawca.send(embed)
		let channel = nadawca.dmChannel;
		if (!channel) channel = await nadawca.createDM();

		let responses = await channel.awaitMessages(
			msg => msg.author.id === nadawca.id,
			{ time: 300000, max: 1 }
		);

		let answer = responses.first().attachments.array()[0]
		let nameArray = answer.name.split('/'); //Split the name 
		let attEx = nameArray[nameArray.length - 1] //Grap the last value of the array.
		if (!pliki) pliki = ""
		pliki += `\n[${attEx}](${answer.url})`
		embed = new Discord.MessageEmbed()
			.setAuthor('Czilerka', client.user.avatarURL())
			.setTitle(`Report`)
			.setColor("#ff4d00")
			.setDescription(`Wpisz **Stop** aby przerwać proces w dowolnym momencie!\nChcesz załączyć pliki do reportu? Wpisz **tak** lub **nie**`)
		nadawca.send(embed)

		responses = await channel.awaitMessages(
			msg => msg.author.id === nadawca.id,
			{ time: 300000, max: 1 }
		);
		let answer3 = responses.first().content

		return report(nadawca, odbiorca, answer3, pliki, serwer)
	} if (odpowiedz == `nie`) {
		let embed = new Discord.MessageEmbed()
			.setAuthor('Czilerka', client.user.avatarURL())
			.setTitle(`Report`)
			.setColor("#ff4d00")
			.setDescription(`Podaj treść swojego reportu!`)
		nadawca.send(embed)

		let channel = nadawca.dmChannel;
		if (!channel) channel = await nadawca.createDM();

		responses = await channel.awaitMessages(
			msg => msg.author.id === nadawca.id,
			{ time: 300000, max: 1 }
		);
		let answer2 = responses.first().content

		embed = new Discord.MessageEmbed()
			.setAuthor('Czilerka', client.user.avatarURL())
			.setTitle(`Report`)
			.setColor("#ff4d00")
			.setDescription(`
Nadawca: ${nadawca}
Odbiorca: ${odbiorca}
Pliki: ${pliki ? pliki : `Brak`}
Treść: ${answer2}`)
		let gld = client.guilds.cache.get(serwer)
		let kanal = gld.channels.cache.get(configID.reportAdmID)
		if (kanal) kanal.send(embed)
		return nadawca.send(embed)
	} if (odpowiedz == `stop`) {
		let embed = new Discord.MessageEmbed()
			.setAuthor('Czilerka', client.user.avatarURL())
			.setTitle(`Report`)
			.setColor("#ff4d00")
			.setDescription(`Anulowano report!`)
		return nadawca.send(embed)
	} else {
		let embed = new Discord.MessageEmbed()
			.setAuthor('Czilerka', client.user.avatarURL())
			.setTitle(`Report`)
			.setColor("#ff4d00")
			.setDescription(`Podano zły argument! Wpisz **Stop** aby przerwać proces w dowolnym momencie!\nChcesz załączyć pliki do reportu? Wpisz **tak** lub **nie**`)
		nadawca.send(embed)

		let channel = nadawca.dmChannel;
		if (!channel) channel = await nadawca.createDM();

		let responses = await channel.awaitMessages(
			msg => msg.author.id === nadawca.id,
			{ time: 300000, max: 1 }
		);
		return report(nadawca, odbiorca, responses, pliki, serwer)
	}
}

client.on("message", async message => {
	if (message.guild && !message.author.bot) {
		if (message.channel.id == configID.reportID) {
			let pliki = ""
			let member = message.mentions.members.first()
			if (!member) return message.delete()
			message.delete()
			let embed = new Discord.MessageEmbed()
				.setAuthor('Czilerka', client.user.avatarURL())
				.setTitle(`Report`)
				.setColor("#ff4d00")
				.setDescription(`Wpisz **Stop** aby przerwać proces w dowolnym momencie!\nChcesz załączyć pliki do reportu? Wpisz **tak** lub **nie**`)
			message.member.send(embed)

			let channel = message.author.dmChannel;
			if (!channel) channel = await message.author.createDM();

			let responses = await channel.awaitMessages(
				msg => msg.author.id === message.author.id,
				{ time: 300000, max: 1 }
			);
			let answer1 = responses.first().content

			return report(message.author, member, answer1, pliki, message.guild.id)
		}
	}
})
// ###################### EKONOMIA I MODERACJA ################# //

setInterval(async () => {
	client.channels.cache.each((channel) => {
		if (channel.type != "voice") return;
		channel.members.each((member) => {
			let money = db.fetch(`money_${member.guild.id}_${member.id}`);
			if (!money) {
				return db.set(`money_${member.guild.id}_${member.id}`, 0);
			} return db.add(`money_${member.guild.id}_${member.id}`, 2)
		})
	});
}, 360000);

setInterval(async () => {
	let every = db
		.all()
		.filter(i => i.ID.startsWith(`vipkoniec_`))
	every.forEach((vip) => {
		user = vip.ID.split('_')[2]
		let guildid = vip.ID.split('_')[1]
		czas = vip.data
		if (czas <= Date.now()) {
			db.delete(`vipkoniec_${guildid}_${user}`)
			let guild2 = client.guilds.cache.find(guild => guild.id === guildid);
			let user2 = guild2.members.cache.get(user)
			rola = guild2.roles.cache.find(r => r.id === configID.vipRoleID)
			user2.roles.remove(rola)
			let embed = new Discord.MessageEmbed()
				.setColor('#fffb00')
				.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
				.setDescription(`Twój **VIP** właśnie się skończył :(`)
			user2.send(embed);
		}
	})
}, 90000);

setInterval(async () => {
	let every = db
		.all()
		.filter(i => i.ID.startsWith(`ban_time`))
	every.forEach(async (ban) => {
		let user = ban.ID.split('_')[3]
		let guildid = ban.ID.split('_')[2]
		let czas = ban.data
		if (czas <= Date.now()) {
			let serwer = await client.guilds.cache.get(guildid)
			serwer.members.unban(user)
			db.delete(`ban_time_${serwer.id}_${user}`)
		}
	})
}, 68000);

setInterval(async () => {
	let every2 = db
		.all()
		.filter(i => i.ID.startsWith(`premiumvipkoniec_`))
	every2.forEach((vip) => {
		let user = vip.ID.split('_')[2]
		let guildid = vip.ID.split('_')[1]
		czas = vip.data
		if (czas <= Date.now()) {
			db.delete(`premiumvipkoniec_${guildid}_${user}`)
			let guild2 = client.guilds.cache.find(guild => guild.id === guildid);
			let user2 = guild2.members.cache.get(user)
			rola = guild2.roles.cache.find(r => r.id === configID.vipPremiumRoleID)
			user2.roles.remove(rola)
			let embed = new Discord.MessageEmbed()
				.setColor('#fffb00')
				.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
				.setDescription(`Twój **PREMIUM VIP** właśnie się skończył :(`)
			user2.send(embed);
		}
	})
}, 95000);

setInterval(async () => {
	let every4 = db
		.all()
		.filter(i => i.ID.startsWith(`farmaodbierz_`))
	every4.forEach((vip) => {
		let user = vip.ID.split('_')[2]
		let guildid = vip.ID.split('_')[1]
		czas = vip.data
		if (czas <= Date.now()) {
			db.set(`farmaodbierz_${guildid}_${user}`, Date.now() + 86400000)
			db.add(`money_${guildid}_${user}`, 500)
		}
	})
}, 67500);


setInterval(async () => {
	let every4 = db
		.all()
		.filter(i => i.ID.startsWith(`farma_`))
	every4.forEach((vip) => {
		let user = vip.ID.split('_')[2]
		let guildid = vip.ID.split('_')[1]
		czas = vip.data
		if (czas <= Date.now()) {
			db.delete(`farma_${guildid}_${user}`)
			let guild2 = client.guilds.cache.find(guild => guild.id === guildid);
			let user2 = guild2.members.cache.get(user)
			let embed = new Discord.MessageEmbed()
				.setColor('#fffb00')
				.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
				.setDescription(`Twoja farma właśnie straciła ważność i została usunięta!`)
			user2.send(embed);
		}
	})
}, 320000);

setInterval(async () => {
	let every5 = db
		.all()
		.filter(i => i.ID.startsWith(`kanalczas_`))
	every5.forEach((kanal) => {
		let user = kanal.ID.split('_')[2]
		let guildid = kanal.ID.split('_')[1]
		czas = kanal.data
		if (czas <= Date.now()) {
			let guild2 = client.guilds.cache.find(guild => guild.id === guildid);
			let user2 = guild2.members.cache.get(user)
			let embed = new Discord.MessageEmbed()
				.setColor('#fffb00')
				.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
				.setDescription(`Twój prywatny kanał głosowy właśnie stracił ważnośc i został usunięty!`)
			user2.send(embed);
			let kanalek = guild2.channels.cache.find(channel => channel.id === db.fetch(`kanalID_${guildid}_${user}`))
			if (kanalek) kanalek.delete()
			db.delete(`kanal_${guildid}_${user}`)
			db.delete(`kanalID_${guildid}_${user}`)
			db.delete(`kanalczas_${guildid}_${user}`)
		}
	})
}, 180000);

// ###################### REACTION ROLES ################# //

client.on("messageReactionAdd", async (reaction, user) => {
	if (user.bot) return
	let message = await reaction.message;
	if (
		message.reactions.cache.forEach(reaction =>
			reaction.users.cache.has(user.id)
		)
	) {
		console.log("yes");
	}
	let menus = db.get(`rr_${message.guild.id}`);
	let menu;
	let menuIndex;
	if (!menus) return;
	for (let i = 0; i < menus.length; i++) {
		if (menus[i].ChannelID == message.channel.id && menus[i].ID == message.id) {
			menuIndex = i;
			menu = menus[i];
		}
	}
	if (!menu) return;
	let role;
	for (let i = 0; i < menu.roles.length; i++) {
		let type = reaction.emoji.id ? reaction.emoji.id : reaction.emoji.name;
		if (type == menu.roles[i].reaction) {
			role = menu.roles[i].role;
		}
	}
	if (menu.type != "single") {
		role = message.guild.roles.cache.find(x => x.id == role);
		if (!role) return;
		let member = message.guild.members.cache.find(x => x.id == user.id);
		if (!member) return;
		if (member.roles.cache.has(role.id)) return;
		member.roles.add(role.id);
		return;
	} else {
		if (menu.usersReacted.includes(user.id)) {
			await reaction.users.remove(user.id);
			return user
				.send(
					"You have already took role from this reaction set and you cannot take another!"
				)
				.catch(e => {
					return;
				});
		}
		role = message.guild.roles.cache.find(x => x.id == role);
		if (!role) return;
		let member = message.guild.members.cache.find(x => x.id == user.id);
		if (!member) return;
		if (member.roles.cache.has(role.id)) return;
		member.roles.add(role.id);
		menus[menuIndex] = menu;
		menu.usersReacted.push(user.id);
		db.set(`rr_${message.guild.id}`, menus);
		return;
	}
});
/*******/ /*******/ /*******/ /*******/

/*******/ /*Reaction Remove*//*******/

/*******/ /*******/ /*******/ /*******/
client.on("messageReactionRemove", async (reaction, user) => {
	if (user.bot) return
	let message = await reaction.message;
	let menus = db.get(`rr_${message.guild.id}`);
	let menu;
	let menuIndex;

	if (!menus) return;
	for (let i = 0; i < menus.length; i++) {
		if (menus[i].ChannelID == message.channel.id && menus[i].ID == message.id) {
			menu = menus[i];
			menuIndex = i;
		}
	}
	if (!menu) return;
	let role;
	for (let i = 0; i < menu.roles.length; i++) {
		let type = reaction.emoji.id ? reaction.emoji.id : reaction.emoji.name;
		if (type == menu.roles[i].reaction) {
			role = menu.roles[i].role;
		}
	}
	if (menu.type != "single") {
		role = message.guild.roles.cache.find(x => x.id == role);
		if (!role) return;
		let member = message.guild.members.cache.find(x => x.id == user.id);
		if (!member) return;
		if (!member.roles.cache.has(role.id)) return;
		member.roles.remove(role.id);
		return;
	} else {
		role = message.guild.roles.cache.find(x => x.id == role);
		if (!role) return;
		let member = message.guild.members.cache.find(x => x.id == user.id);
		if (!member) return;
		if (!member.roles.cache.has(role.id)) return;
		if (menu.usersReacted.includes(user.id)) {
			let index;
			for (let i = 0; i < menu.usersReacted.length; i++) {
				if (menu.usersReacted[i] == user.id) {
					index = i;
				}
			}
			if (index != -1) {
				menu.usersReacted.splice(index, 1);
				menus[menuIndex] = menu;
				db.set(`rr_${message.guild.id}`, menus);
			}
		}
		member.roles.remove(role.id);
		return;
	}
});

// ###################### LEVELE ################# //

client.on("guildMemberRemove", async member => {
	levele.delete(`level_${member.guild.id}_${member.id}`)
});

//########################//
//######## Levele vc #########//
//########################//

async function rolinio(nowarola, stararola, user, guild) {
	const mMember = user.member || guild.members.cache.get(user.id)
	let nowarolacheck = guild.roles.cache.find(x => x.id == nowarola.id);
	await mMember.roles.add(nowarolacheck.id);
}

client.on("voiceStateUpdate", async (client, newState, oldState) => {
	if (!newState.channel) {
		if (newState.member.user.bot) return;
		db.set(`wejscie_${newState.guild.id}_${newState.member.id}`, Date.now());
	}
});

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

setInterval(async () => {
	client.channels.cache.each(channel => {
		if (channel.type != "voice") return;
		let liczba = 0;
		channel.members.each(memberek => {
			if (!memberek.user.bot) liczba++;
		});
		if (liczba < 2) return;
		channel.members.each(async member => {
			if (member.user.bot) return;
			let data = db.get(`wejscie_${member.guild.id}_${member.id}`) || 0;
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
				levelObj = levele.get(`level_${member.guild.id}_${member.id}`);
				levele.set(`GlobalTextXP_${member.guild.id}_${member.id}`, 0);
				levele.set(`GlobalVCXP_${member.guild.id}_${member.id}`, 0);
			}
			if (!levelObj.ReqVCXP) {
				levelObj.ReqTextXP = levels[levelObj.level += 1]
				levelObj.ReqVCXP = levels[levelObj.levelVC += 1]
				levele.set(`level_${message.guild.id}_${message.member.id}`, levelObj)
			}
			if (!Date.now() - data >= 1000) return;
			let randomxp = getRandomInt(14, 22);
			levelObj.VCXP += randomxp;
			levele.add(`GlobalVCXP_${member.guild.id}_${member.id}`, randomxp);
			if (levelObj.VCXP >= levelObj.ReqVCXP && levelObj.levelVC != 150) {
				levelObj.VCXP -= levelObj.ReqVCXP;
				levelObj.levelVC += 1;
				levelObj.ReqVCXP = levels[Math.floor(levelObj.levelVC + 1)];
				levele.set(`level_${member.guild.id}_${member.id}`, levelObj);
				let kanal = member.guild.channels.cache.get(configID.levelupChannelID);
				if (kanal) kanal.send(`Gratulacje ${member}! Osiągnięto poziom głosowy ${levelObj.levelVC}!`)
				lvlcheckvc(member.guild, member, levelObj)
			} else levele.set(`level_${member.guild.id}_${member.id}`, levelObj);
		});
	});
}, 360000);

async function lvlcheckvc(guild, user, levelObj) {
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

//########################//
//######## levele textowe #########//
//########################//

async function lvlcheck(guild, user, levelObj) {
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

client.on("message", async message => {
	if (message.author.bot) return;
	if (!message.guild) return;
	let levelObj = levele.get(`level_${message.guild.id}_${message.author.id}`);
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
		levele.set(`level_${message.guild.id}_${message.author.id}`, levelObj);
		levele.set(`GlobalTextXP_${message.guild.id}_${message.author.id}`, 0);
		levele.set(`GlobalVCXP_${message.guild.id}_${message.author.id}`, 0);
		levelObj = levele.get(`level_${message.guild.id}_${message.author.id}`);
	}
	if (!levelObj.ReqTextXP) {
		levelObj.ReqTextXP = levels[levelObj.level += 1]
		levelObj.ReqVCXP = levels[levelObj.levelVC += 1]
		levele.set(`level_${message.guild.id}_${message.member.id}`, levelObj)
	}
	if (!message.content.startsWith("!", ".")) {
		let dlugosc = message.content.length;
		if (dlugosc < 21) {
			let xp2 = Math.floor(10 + dlugosc / 2);
			levelObj.TextXP += xp2;
			levele.add(`GlobalTextXP_${message.guild.id}_${message.author.id}`, xp2);
		} else {
			levelObj.TextXP += 20;
			levele.add(`GlobalTextXP_${message.guild.id}_${message.author.id}`, 20);
		}
		if (levelObj.TextXP >= levelObj.ReqTextXP && levelObj.level != 150) {
			levelObj.TextXP -= levelObj.ReqTextXP;
			levelObj.level += 1;
			levelObj.ReqTextXP = levels[Math.floor(levelObj.level + 1)];
			levele.set(`level_${message.guild.id}_${message.author.id}`, levelObj);
			let kanal = message.guild.channels.cache.get(configID.levelupChannelID);
			if (kanal) kanal.send(`Gratulacje ${message.member}! Osiągnięto poziom tekstowy ${levelObj.level}!`)
			lvlcheck(message.guild, message.member, levelObj)
		} else levele.set(`level_${message.guild.id}_${message.author.id}`, levelObj);
	}
});

// ###################### WERYFIKACJA ################# //

client.on("messageReactionAdd", async (reaction, user) => {
	if (user.bot) return
	let message = await reaction.message;
	if (
		message.reactions.cache.forEach(reaction =>
			reaction.users.cache.has(user.id)
		)
	) {
		console.log("yes");
	}
	let weryfikacja = db.get(`weryfikacja_${message.guild.id}`);
	if (!weryfikacja) return;
	let rola = weryfikacja.role;
	rola = message.guild.roles.cache.find(x => x.id == rola);
	if (!rola) return;
	let member = message.guild.members.cache.find(x => x.id == user.id);
	if (!member) return;
	if (!weryfikacja.wiadomosc.id == reaction.message.id) return
	if (member.roles.cache.has(rola.id)) return;
	member.roles.add(rola.id);
	let role = configID.roleWeryfikacji
	role.forEach((rola) => {
		if (message.guild.roles.cache.get(rola)) {
			member.roles.add(rola)
		}
	})
	return;
});

client.on("messageReactionRemove", async (reaction, user) => {
	if (user.bot) return
	let message = await reaction.message;
	if (
		message.reactions.cache.forEach(reaction =>
			reaction.users.cache.has(user.id)
		)
	) {
		console.log("yes");
	}
	let weryfikacja = db.get(`weryfikacja_${message.guild.id}`);
	if (!weryfikacja) return;
	if (message.channel.id == weryfikacja.kanal) {
		let rola = weryfikacja.role;
		rola = message.guild.roles.cache.find(x => x.id == rola);
		if (!rola) return;
		let member = message.guild.members.cache.find(x => x.id == user.id);
		if (!member) return;
		if (!weryfikacja.wiadomosc.id == reaction.message.id) return
		if (!member.roles.cache.has(rola.id)) return;
		member.roles.remove(rola.id);
		return;
	}
});

//################## LOGI #########################//

const logs = require('discord-logs');
const { config } = require("process");
logs(client);

client.on(`messageDelete`, async (message) => {
	let kanal = message.guild.channels.cache.get(`800504909479936010`)
	if (kanal) {
		let embed = new Discord.MessageEmbed()
			.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
			.setTitle(`Usunięto wiadomość`)
			.setColor("RED")
			.setTimestamp()
			.setDescription(`Wiadomość użytkownika ${message.author} została usunięta na kanale \n${message.channel}\n${message.content}`)
		kanal.send(embed)
	}
})

client.on("messageContentEdited", async (message, oldContent, newContent) => {
	let kanal = message.guild.channels.cache.get(`800504910709915729`)
	if (kanal) {
		let embed = new Discord.MessageEmbed()
			.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
			.setTitle(`Edytowano wiadomość`)
			.setColor("BLUE")
			.setTimestamp()
			.setDescription(`Edytowano wiadomość użytkownika ${message.author} na kanale \n${message.channel}\nStara wiadomość: ${oldContent}\nNowa wiadomość: ${newContent}`)
		kanal.send(embed)
	}
});

client.on("voiceChannelJoin", async (member, channel) => {
	let kanal = member.guild.channels.cache.get(`800504911728082965`)
	if (kanal) {
		let embed = new Discord.MessageEmbed()
			.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
			.setTitle(`Dołączono na kanał głosowy`)
			.setColor("GREEN")
			.setTimestamp()
			.setDescription(`Użytkownik ${member} dołączył na kanał głosowy \n\`${channel.name}\``)
		kanal.send(embed)
	}
});

client.on("voiceChannelLeave", async (member, channel) => {
	let kanal = member.guild.channels.cache.get(`800504912639033415`)
	if (kanal) {
		let embed = new Discord.MessageEmbed()
			.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
			.setTitle(`Rozłączono z kanałem głosowym`)
			.setColor("RED")
			.setTimestamp()
			.setDescription(`Użytkownik ${member} wyszedł z kanału głosowego \n\`${channel.name}\``)
		kanal.send(embed)
	}
});

client.on("voiceChannelSwitch", async (member, oldChannel, newChannel) => {
	let kanal = member.guild.channels.cache.get(`771060077414449176`)
	if (kanal) {
		let embed = new Discord.MessageEmbed()
			.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
			.setTitle(`Zmieniono kanał głosowy`)
			.setColor("BLUE")
			.setTimestamp()
			.setDescription(`Użytkownik ${member} zmienił kanał głosowy z kanału \n\`${oldChannel.name}\` na kanał \`${newChannel.name}\``)
		kanal.send(embed)
	}
});

const muted = {
	"self-muted": "użytkownika",
	"self-deafed": "użytkownika",
	"server-muted": "serwerowe",
	"server-v": "serwerowe"
};

client.on("voiceChannelMute", async (member, muteType) => {
	let kanal = member.guild.channels.cache.get(`771060631674683422`)
	if (kanal) {
		let embed = new Discord.MessageEmbed()
			.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
			.setTitle(`Wyciszenie`)
			.setColor("RED")
			.setTimestamp()
			.setDescription(`Użytkownik ${member} został wyciszony na kanale głosowym \n\`${member.voice.channel.name}\`\nRodzaj wyciszenia: \`${muted[muteType]}\``)
		kanal.send(embed)
	}
});

client.on("voiceChannelUnmute", async (member, oldMuteType) => {
	let kanal = member.guild.channels.cache.get(`771060631674683422`)
	if (kanal) {
		let embed = new Discord.MessageEmbed()
			.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
			.setTitle(`Odciszenie`)
			.setColor("GREEN")
			.setTimestamp()
			.setDescription(`Użytkownik ${member} został odciszony na kanale głosowym \n\`${member.voice.channel.name}\`\nRodzaj wyciszenia: \`${muted[oldMuteType]}\``)
		kanal.send(embed)
	}
});

client.on("voiceChannelDeaf", async (member, deafType) => {
	let kanal = member.guild.channels.cache.get(`800504914874466334`)
	if (kanal) {
		let embed = new Discord.MessageEmbed()
			.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
			.setTitle(`Wyciszenie serwerowe`)
			.setColor("RED")
			.setTimestamp()
			.setDescription(`Użytkownik ${member} został wyciszony serwerowo na kanale głosowym \n\`${member.voice.channel.name}\`\nRodzaj wyciszenia: \`${muted[deafType]}\``)
		kanal.send(embed)
	}
});

client.on("voiceChannelUndeaf", async (member, oldDeafType) => {
	let kanal = member.guild.channels.cache.get(`800504914874466334`)
	if (kanal) {
		let embed = new Discord.MessageEmbed()
			.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
			.setTitle(`Odciszenie serwerowe`)
			.setColor("GREEN")
			.setTimestamp()
			.setDescription(`Użytkownik ${member} został odciszony serwerowo na kanale głosowym \n\`${member.voice.channel.name}\`\nRodzaj wyciszenia: \`${muted[oldDeafType]}\``)
		kanal.send(embed)
	}
});

client.on("guildMemberAdd", async (member) => {
	let kanal = member.guild.channels.cache.get(`800504915905871881`)
	if (kanal) {
		let embed = new Discord.MessageEmbed()
			.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
			.setTitle(`Dołączył na serwer`)
			.setColor("GREEN")
			.setTimestamp()
			.setDescription(`Użytkownik ${member} dołączył na serwer!`)
		kanal.send(embed)
	}
});

client.on("guildMemberRemove", async (member) => {
	let kanal = member.guild.channels.cache.get(`800504916933083136`)
	if (kanal) {
		let embed = new Discord.MessageEmbed()
			.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
			.setTitle(`Wyszedł z serwera`)
			.setColor("RED")
			.setTimestamp()
			.setDescription(`Użytkownik ${member} wyszedł z serwera!`)
		kanal.send(embed)
	}
});

client.on("guildBanAdd", async (guild, user) => {
	let kanal = guild.channels.cache.get(`800504918220996608`)
	if (kanal) {
		let embed = new Discord.MessageEmbed()
			.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
			.setTitle(`Zbanowano`)
			.setColor("RED")
			.setTimestamp()
			.setDescription(`Użytkownik ${user} został zbanowany!`)
		kanal.send(embed)
	}
});

client.on("guildBanRemove", async (guild, user) => {
	let kanal = guild.channels.cache.get(`800504918220996608`)
	if (kanal) {
		let embed = new Discord.MessageEmbed()
			.setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
			.setTitle(`Odbanowano`)
			.setColor("GREEN")
			.setTimestamp()
			.setDescription(`Użytkownik ${user} został odbanowany!`)
		kanal.send(embed)
	}
});

// ###################### AUTO MODERACJA / MODERACJA ################# //

client.on("message", async (message) => {
	if (!message.guild || message.author.bot) return;
	if (message.content.length > 500) {
		if (message.member.hasPermission(`MANAGE_MESSAGES`)) return
		message.delete()
	}
	if (!message.content.includes("discord.gg/")) return;
	message.guild.fetchInvites().then(async g => {
		let invites = g.array()
		let check = false
		if (message.content.includes("discord.gg/"))
			for (let i = 0; i < invites.length; i++) {
				if (message.member.id === "292953664492929025") return;
				if (message.content.includes(`discord.gg/${invites[i]}`))
					return check = true
			}
		if (check) {
			return;
		} else {
			reason = "wysyłanie zaproszeń do innych serwerów"
			if (message.member.hasPermission("ADMINISTRATOR")) return;
			client.channels.cache.get(message.channel.id).messages.fetch(message.id).then(message => message.delete())
			let member = message.member || message.guild.members.cache.get(message.member.id)
			const embed = new Discord.MessageEmbed()
				.setAuthor(`Czilerka`, `https://cdn.discordapp.com/avatars/735993989475598417/82577c38eb8beb55abb0e1e0463167c0.webp`)
				.setTitle("Zbanowano " + member.user.username, member.user.avatarURL({ dynamic: true, size: 64 }))
				.setColor("RED")
				.setTimestamp(Date.now())
				.setThumbnail(member.user.avatarURL({ dynamic: true }))
				.addFields(
					{ name: "Użytkownik", value: member.user, inline: true },
					{ name: "Powód", value: reason, inline: true }
				)
			const channel = client.channels.cache.get('800504898880929802');
			await member.send({ embed: embed }).then(() => member.send(`Jeżeli twierdzisz że twoja kara jest niesłuszna skontaktuj sie z nami na naszym serwerze support: \nhttps://discord.gg/x7ETjuR`))
			member.ban({ reason: reason }).catch(error => message.channel.send("Nie można zbanować użytkownika\n " + error))
			channel.send(embed)
		}
	}
	)
}
)

setInterval(async () => {
	let every = db
		.all()
		.filter(i => i.ID.startsWith(`mute_time_`))
		.forEach((mute) => {
			userid = (mute.ID.split('_')[3])
			guildid = (mute.ID.split('_')[2])
			mutetime = db.get(`mute_time_${guildid}_${userid}`)
			if (mutetime <= Date.now()) {
				let guild = client.guilds.cache.get(guildid)
				let member = guild.members.cache.find(x => x.id === userid)
				let mrole = guild.roles.cache.find(r => r.name === 'Muted')
				mrole = guild.roles.cache.find((x) => x.id == mrole.id)
				if (member) member.roles.remove(mrole.id)
				db.delete(`mute_time_${guildid}_${userid}`)
				let color = "ff6fe7"
				let embed = new Discord.MessageEmbed()
					.setColor(color)
					.setTitle('✅ ┃ Zostałeś odciszony na czacie tekstowym!')
					.setDescription(`<:czilerka:776995901612097537> Twoja kara czasowa minęła, możesz już swobodnie pisać na serwerze **__Czilerka!__**`)
				member.send(embed)
			}
		});
}, 18570);

setInterval(async () => {
	let every = db
		.all()
		.filter(i => i.ID.startsWith(`vcmute_time_`))
		.forEach((mute) => {
			userid = (mute.ID.split('_')[3])
			guildid = (mute.ID.split('_')[2])
			mutetime = db.get(`vcmute_time_${guildid}_${userid}`)
			if (mutetime <= Date.now()) {
				let guild = client.guilds.cache.get(guildid)
				let member = guild.members.cache.find(x => x.id === userid)
				if (member) member.voice.setMute(false)
				db.delete(`vcmute_time_${guildid}_${userid}`)
				let color = "ff6fe7"
				let embed = new Discord.MessageEmbed()
					.setColor(color)
					.setTitle('✅ ┃ Zostałeś odciszony na czacie głosowym!')
					.setDescription(`<:czilerka:776995901612097537> Twoja kara czasowa minęła, możesz już swobodnie rozmawiać na serwerze **__Czilerka!__**`)
				member.send(embed)
			}
		});
}, 14739);

// ###################### INVITE ################# //

let invites = {}

client.on('ready', async () => {
	client.guilds.cache.forEach(g => {
		g.fetchInvites().then(guildInvites => {
			invites[g.id] = guildInvites;
		}).catch(e => { });
	});
	console.log("READY!")
})

client.on("guildMemberAdd", async (member) => {
	member.guild.fetchInvites().then(GuildInvites => {
		let ei = invites[member.guild.id]
		invites[member.guild.id] = GuildInvites;
		let invite = GuildInvites.find(i => ei.get(i.code).uses < i.uses);
		if (!invite) return;
		let inviter = client.users.cache.get(invite.inviter.id)
		if (Date.now() - member.user.createdTimestamp < 2592000000) {
			let obj = db.get(`invites_${member.guild.id}_${inviter.id}`)
			if (!obj) {
				obj = {
					id: m.id,
					normal: 0,
					fake: 0,
					left: 0,
					invitedUID: []
				}
			}
			obj.fake += 1
			let userObj = {
				userID: member.id,
				type: "fake"
			}
			obj.invitedUID.push(userObj)
			db.set(`invites_${member.guild.id}_${inviter.id}`, obj)
			console.log(`${member.user.username} joined via ${inviter.tag}`)
			return;
		} else {
			let obj = db.get(`invites_${member.guild.id}_${inviter.id}`)
			if (!obj) {
				obj = {
					id: m.id,
					normal: 0,
					fake: 0,
					left: 0,
					invitedUID: []
				}
			}
			obj.normal += 1
			let userObj = {
				userID: member.id,
				type: "normal"
			}

			obj.invitedUID.push(userObj)

			db.set(`invites_${member.guild.id}_${inviter.id}`, obj)
			console.log(`${member.user.username} joined via ${inviter.tag}`)
		}

	}).catch(e => { })
})

client.on('guildMemberRemove', async (member) => {
	member.guild.members.cache.forEach(m => {
		let obj = db.get(`invites_${member.guild.id}_${m.id}`)
		if (!obj) return;
		obj.invitedUID.forEach(x => {
			if (x.userID == member.id) {
				obj.left += 1
				db.set(`invites_${member.guild.id}_${m.id}`, obj)
			}
		})
	})
})

client.login("")
