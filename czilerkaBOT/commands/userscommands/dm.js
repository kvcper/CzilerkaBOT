const discord = require("discord.js")

module.exports = {
    name: "dm",
    triggers: [
		["dm"],
	],
    run: async (client, message, args) => { 
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Nie posiadasz uprawnień, aby to zrobić!")
let user = message.mentions.users.first()
if(!user) return message.channel.send("Nie podano osoby do, której chcesz napisać!")
let content = args.slice(1).join(" ")
if(args[800]) return message.channel.send("Podano za dużą wiadomość!")
let embed = new discord.MessageEmbed()
.setTitle(message.author.username + " napisał do ciebie wiadomość")
.setDescription(content)
.setColor('#ff00a2')
.setFooter(message.author.username, message.author.avatarURL({dynamic: true}))
user.send(embed).catch(error => message.channel.send("Wystąpił problem " + error))
message.delete()
    }
}