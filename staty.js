const { Client, Collection } = require("discord.js");
const Discord = require("discord.js");
const client = new Client();

client.commands = new Collection();
client.aliases = new Collection();
client.queue = new Map();
["commands"].forEach(async handler => {
	require(`./handlers/${handler}`)(client);
});

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const Staty = require("./models/staty.js");
const Statyvc = require("./models/statyvc.js");
const Statyguild = require("./models/statyguild.js");

client.on("message", async message => {
	if (message.author.bot) return;
	if (!message.guild) return;
	const guildConfig = require(`./Config/config.json`)
	if (guildConfig) {
		if (message.author.bot) return
		let prefix = `!`
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
	}
});

//########################//
//######## Stats #########//
//########################//

client.on("message", async message => {
	if (message.guild && !message.author.bot) {
		Staty.findOne({
			userID: message.member.id,
			guildID: message.guild.id
		}, async (err, staty) => {
			if (err) console.log(err)
			if (!staty) {
				const newStaty = new Staty({
					userID: message.member.id,
					guildID: message.guild.id,
					messages24h: { date: Date.now(), msg: 1 },
					messages7d: [{ date: Date.now(), msg: 1 }],
					messages30d: [{ date: Date.now(), msg: 1 }],
					messagesChannels: [{ Id: message.channel.id, value: [{ date: Date.now(), msg: 1 }] }],
					messagesIDChannels: [{ Id: message.channel.id }],
				})
				newStaty.save().catch(err => console.log(err))
				Statyguild.findOne({
					guildID: message.guild.id
				}, async (err, staty) => {
					if (err) console.log(err)
					if (!staty) {
						const newStaty = new Statyguild({
							guildID: message.guild.id,
							topChannels: [{ Id: message.channel.id, value: [{ date: Date.now(), msg: 1 }] }],
							topChannelsID: [{ Id: message.channel.id }]
						})
						newStaty.save().catch(err => console.log(err))
					}
				})
			} else {
				if (Date.now() - staty.messages24h.date > 86400000) {
					staty.messages24h = { date: Date.now(), msg: 0 }
				}
				staty.messages24h.msg = Number(staty.messages24h.msg + 1)
				staty.messages7d[staty.messages7d.length - 1].msg = Number(staty.messages7d[staty.messages7d.length - 1].msg + 1)
				if (Date.now() - staty.messages7d[0].date > 604800000) {
					staty.messages7d.splice(0, 1)
					staty.messages7d.push({ msg: 0, date: Date.now() })
				}
				if (Date.now() - staty.messages7d[staty.messages7d.length - 1].date > 86400000) {
					staty.messages7d.push({ msg: 0, date: Date.now() })
				}
				staty.messages30d[staty.messages30d.length - 1].msg = Number(staty.messages30d[staty.messages30d.length - 1].msg + 1)
				if (Date.now() - staty.messages30d[0].date > 2592000000) {
					staty.messages30d.splice(0, 1)
					staty.messages30d.push({ msg: 0, date: Date.now() })
				}
				if (Date.now() - staty.messages30d[staty.messages30d.length - 1].date > 86400000) {
					staty.messages30d.push({ msg: 0, date: Date.now() })
				}
				let index
				let check = false
				for (i = 0; i < staty.messagesIDChannels.length; i++) {
					if (staty.messagesIDChannels[i].Id == message.channel.id) {
						index = i
						check = true
					}
				}
				if (check) {
					staty.messagesChannels[index].value[staty.messagesChannels[index].value.length - 1].msg = Number(staty.messagesChannels[index].value[staty.messagesChannels[index].value.length - 1].msg + 1)
					if (Date.now() - staty.messagesChannels[index].value[0].date > 2592000000) {
						staty.messagesChannels[index].value.splice(0, 1)
						staty.messagesChannels[index].value.push({ msg: 0, date: Date.now() })
					}
					if (Date.now() - staty.messagesChannels[index].value[0].date > 86400000) {
						staty.messagesChannels[index].value.push({ msg: 0, date: Date.now() })
					}
				} else {
					staty.messagesIDChannels.push({ Id: message.channel.id })
					staty.messagesChannels.push({ Id: message.channel.id, value: [{ date: Date.now(), msg: 0 }] })
				}
				await staty.save().catch(err => console.log(err))
				//#GSTATY KANALOWE#//
				Statyguild.findOne({
					guildID: message.guild.id
				}, async (err, staty2) => {
					if (err) console.log(err)
					if (!staty2) {
						const newStaty = new Statyguild({
							guildID: message.guild.id,
							topChannels: [{ Id: message.channel.id, value: [{ date: Date.now(), msg: 1 }] }],
							topChannelsID: [{ Id: message.channel.id }]
						})
						newStaty.save().catch(err => console.log(err))
					} else {
						let index
						let check = false
						for (i = 0; i < staty2.topChannelsID.length; i++) {
							if (staty2.topChannelsID[i].Id == message.channel.id) {
								index = i
								check = true
							}
						}
						if (check) {
							staty2.topChannels[index].value[staty2.topChannels[index].value.length - 1].msg = Number(staty2.topChannels[index].value[staty2.topChannels[index].value.length - 1].msg + 1)
							if (Date.now() - staty2.topChannels[index].value[0].date > 2592000000) {
								staty2.topChannels[index].value.splice(0, 1)
								staty2.topChannels[index].value.push({ msg: 1, date: Date.now() })
							}
							if (Date.now() - staty2.topChannels[index].value[0].date > 86400000) {
								staty2.topChannels[index].value.push({ msg: 1, date: Date.now() })
							}
						} else {
							staty2.topChannelsID.push({ Id: message.channel.id })
							staty2.topChannels.push({ Id: message.channel.id, value: [{ date: Date.now(), msg: 1 }] })
						}
						await staty2.save().catch(err => console.log(err))
					}
				})

			}
		})
	}
})

const logs = require('discord-logs');
logs(client);

client.on("voiceChannelJoin", async (member, channel) => {
	console.log(member.user.username + ` dolaczyl na vc`)
	await Statyvc.findOne({
		userID: member.id,
		guildID: member.guild.id
	}, async (err, staty) => {
		if (err) console.log(err)
		if (!staty) {
			const newStaty = new Statyvc({
				userID: member.id,
				guildID: member.guild.id,
				voice24h: { date: Date.now(), vc: 120000 },
				voice7d: [{ date: Date.now(), vc: 120000 }],
				voice30d: [{ date: Date.now(), vc: 120000 }],
				voiceChannels: [{ Id: channel.id, value: [{ date: Date.now(), vc: 120000 }] }],
				voiceIDChannels: [{ Id: channel.id }],
				check: 0,
			})
			await newStaty.save().catch(err => console.log(err))
		}
	})
	await Statyvc.findOne({
		userID: member.id,
		guildID: member.guild.id
	}, async (err, staty) => {
		if (err) console.log(err)
		if (staty) {
			staty.check = Number(staty.check += 1)
			await staty.save().catch(err => console.log(err))
		}
	})
	var inter = setInterval(async () => {
		await Statyvc.findOne({
			userID: member.id,
			guildID: member.guild.id
		}, async (err, staty) => {
			if (err) console.log(err)
			if (staty) {
				console.log(staty.check)
				if (staty.check > 1) {
					staty.check = Number(staty.check - 1)
					await staty.save().catch(err => console.log(err))
					clearInterval(inter)
					return console.log(`cancelowalo`)
				}
				let kanal = member.voice.channelID
				if (!kanal) {
					clearInterval(inter)
					return console.log(`cancelowalo bo wyszedl`)
				}
				if (Date.now() - staty.voice24h.date > 86400000) {
					staty.voice24h = { date: Date.now(), vc: 120000 }
				}
				staty.voice24h.vc = Number(staty.voice24h.vc + 120000)
				staty.voice7d[staty.voice7d.length - 1].vc = Number(staty.voice7d[staty.voice7d.length - 1].vc + 120000)
				if (Date.now() - staty.voice7d[0].date > 604800000) {
					staty.voice7d.splice(0, 1)
					staty.voice7d.push({ vc: 120000, date: Date.now() })
				}
				if (Date.now() - staty.voice7d[staty.voice7d.length - 1].date > 86400000) {
					staty.voice7d.push({ vc: 120000, date: Date.now() })
				}
				staty.voice30d[staty.voice30d.length - 1].vc = Number(staty.voice30d[staty.voice30d.length - 1].vc + 120000)
				if (Date.now() - staty.voice30d[0].date > 2592000000) {
					staty.voice30d.splice(0, 1)
					staty.voice30d.push({ vc: 120000, date: Date.now() })
				}
				if (Date.now() - staty.voice30d[staty.voice30d.length - 1].date > 86400000) {
					staty.voice30d.push({ vc: 120000, date: Date.now() })
				}

				let index
				let check = false
				for (i = 0; i < staty.voiceIDChannels.length; i++) {
					if (staty.voiceIDChannels[i].Id == kanal) {
						index = i
						check = true
					}
				}
				if (check) {
					staty.voiceChannels[index].value[staty.voiceChannels[index].value.length - 1].vc = Number(staty.voiceChannels[index].value[staty.voiceChannels[index].value.length - 1].vc + 120000)
					if (Date.now() - staty.voiceChannels[index].value[0].date > 2592000000) {
						staty.voiceChannels[index].value.splice(0, 1)
						staty.voiceChannels[index].value.push({ vc: 120000, date: Date.now() })
					}
					if (Date.now() - staty.voiceChannels[index].value[0].date > 86400000) {
						staty.voiceChannels[index].value.push({ vc: 120000, date: Date.now() })
					}
				} else {
					staty.voiceIDChannels.push({ Id: kanal })
					staty.voiceChannels.push({ Id: kanal, value: [{ date: Date.now(), vc: 120000 }] })
				}
				await staty.save().catch(err => console.log(err))
				console.log(`+stat`)

				await Statyguild.findOne({
					guildID: member.guild.id
				}, async (err, staty2) => {
					if (err) console.log(err)
					if (!staty2) {
						const newStaty = new Statyguild({
							guildID: member.guild.id,
							topChannelsvc: [{ Id: kanal, value: [{ date: Date.now(), vc: 120000 }] }],
							topChannelsIDvc: [{ Id: kanal }]
						})
						await newStaty.save().catch(err => console.log(err))
						console.log(`xd dodalo ` + kanal)
					} else {
						let index
						let check = false
						for (i = 0; i < staty2.topChannelsIDvc.length; i++) {
							if (staty2.topChannelsIDvc[i].Id == kanal) {
								index = i
								check = true
							}
						}
						if (check) {
							staty2.topChannelsvc[index].value[staty2.topChannelsvc[index].value.length - 1].vc = Number(staty2.topChannelsvc[index].value[staty2.topChannelsvc[index].value.length - 1].vc + 120000)
							if (Date.now() - staty2.topChannelsvc[index].value[0].date > 2592000000) {
								staty2.topChannelsvc[index].value.splice(0, 1)
								staty2.topChannelsvc[index].value.push({ vc: 120000, date: Date.now() })
							}
							if (Date.now() - staty2.topChannelsvc[index].value[0].date > 86400000) {
								staty2.topChannelsvc[index].value.push({ vc: 120000, date: Date.now() })
							}
						} else {
							console.log(`xd zapisalo`)
							staty2.topChannelsIDvc.push({ Id: kanal })
							staty2.topChannelsvc.push({ Id: kanal, value: [{ date: Date.now(), vc: 120000 }] })
						}
						await staty2.save().catch(err => console.log(err))
					}
				})
				console.log(member.user.username + `! doliczylo na vc`)
			}
		})
	}, 120000)
})

client.on("voiceChannelLeave", async (member, channel) => {
	await Statyvc.findOne({
		userID: member.id,
		guildID: member.guild.id
	}, async (err, staty) => {
		if (err) console.log(err)
		if (!staty) {
			const newStaty = new Statyvc({
				userID: member.id,
				guildID: member.guild.id,
				voice24h: { date: Date.now(), vc: 120000 },
				voice7d: [{ date: Date.now(), vc: 120000 }],
				voice30d: [{ date: Date.now(), vc: 120000 }],
				voiceChannels: [{ Id: channel.id, value: [{ date: Date.now(), vc: 120000 }] }],
				voiceIDChannels: [{ Id: channel.id }],
				check: 0,
			})
			await newStaty.save().catch(err => console.log(err))
		}
		await Statyvc.findOne({
			userID: member.id,
			guildID: member.guild.id
		}, async (err, staty) => {
			if (err) console.log(err)
			if (staty) {
				console.log(`wyszedl ` + member.user.username)
			}
		})
	})
})

client.login("");
