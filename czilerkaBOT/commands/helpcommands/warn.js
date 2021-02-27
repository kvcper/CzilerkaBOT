const discord = require("discord.js")
const db = require("quick.db")

module.exports = {
    name: "warn",
    triggers: [
		["warn"],
	],
    run: async (client, message, args) => {
        let id = db.get(`warns_ID_${message.guild.id}`)
        if(id == null) {
            db.set(`warns_ID_${message.guild.id}`, 1)
            id = 1
        }
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Nie możesz użyć tej komendy!")
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!member) return message.channel.send("Proszę oznaczyć użytkownika!")
        if (!message.member.roles.highest.comparePositionTo(member.roles.highest) > 0)return message.channel.send("Nie możesz zwarnować kogoś z wyższą lub taką samą rolą")
        let reason = args.slice(1).join(" ")
        if(!reason) return message.channel.send("Nie podano powodu warna")
        let warn = {
            reason: reason,
            id: id,
            user: member.user.id,
            moderator: message.author.id
        }
        db.push(`warnings_${message.guild.id}`, warn)
        db.add(`warns_ID_${message.guild.id}`, 1)

        let warning = db.get(`warnings_${message.guild.id}`)
        var ilosc = 0;
        for (let i = 0; i< warning.length; i++) {
            if(warning[i] == null)continue
            if(warning[i].user != null && warning[i].user == member.user.id){
                ilosc++
            }
        }

        let embed = new discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
        .setColor('#ff0000')
        .setTitle(`Ostrzeżono ${member.user.username}`)
        .addFields(
            {name: message.member.roles.highest.name, value: message.author.username, inline: true},
            {name: "Aktualny stan:", value: ilosc, inline: true},
            {name: "Powód", value: reason},
            {name: "Użytkownik", value: member},
        )
        .setTimestamp()
        .setThumbnail(member.user.avatarURL({dynamic: true}))
        await message.delete()
        message.channel.send(embed).catch(e => console.log(e))

        let embed2 = new discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
        .setColor('#ff0000')
        .setTitle(`Zostałeś ostrzeżony`)
        .addFields(
            {name: message.member.roles.highest.name, value: message.author.username, inline: true},
            {name: "Aktualny stan:", value: ilosc, inline: true},
            {name: "Powód", value: reason},
            {name: "Użytkownik", value: member},
        )
        .setTimestamp()
        .setThumbnail(member.user.avatarURL({dynamic: true}))


        member.send(embed2)
    }
}