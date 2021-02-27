const discord = require("discord.js")

module.exports = {
    name: "kick",
    triggers: [
		["kick"],
	],
    run: async (client, message, args) => {
        //works lmao
        if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Nie masz uprawnień by to zrobić")
        let member = message.mentions.members.first()
        
        if(!member) return message.channel.send("Nie oznaczyłeś użytkownika którego chcesz wyrzucić")
        if(message.guild.ownerID === member.user.id) return message.channel.send("Nie możesz wyrzucić właściciela")
        if(!message.guild.me.hasPermission("KICK_MEMBERS")) return message.channel.send("Nie mam wystarczających permisji aby to zrobić")
        if(message.member.roles.highest.comparePositionTo(member.roles.highest) > 0){
            member.kick({reason: "Bo dlaczego nie kekw"}).catch(error => {
message.channel.send("Nie mogę wyrzucić użytkownika to powód dlaczego\n" + error)
            })
            return message.channel.send("Wyrzuciłeś/-aś " + member.user.username)
        } else return message.channel.send("Nie możesz wyrzucić użytkownika z wyższą lub równą rolą!")

    }
}