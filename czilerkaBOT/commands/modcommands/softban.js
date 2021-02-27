const discord = require("discord.js")

module.exports = {
    name: "softban",
    run: async (client, message, args) => {
        if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("Nie możesz użyć tej komendy")
        let member = message.mentions.members.first()
        if(!member) return message.channel.send("Nie oznaczono użytkownika!")
        if(!message.member.roles.highest.comparePositionTo(member.roles.highest) > 0) return message.channel.send("Nie możesz zbanować kogoś z wyższą lub taką samą rolą")
        member.ban({days: 7}).catch(error => {
            return message.channel.send("Nie można zbanować użytkownika")
        })
        message.guild.unban(member.id, "To tylko softban").catch(error => {
            return message.channel.send("Nie można odbanować użytkownika")
        })
        message.channel.send("Użytkownik dostał softbana")
    }
}

