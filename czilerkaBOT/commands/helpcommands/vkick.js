let discord = require("discord.js")

module.exports = {
    name: "vkick",
    triggers: [
		["vkick"],
	],
    run: async (client, message, args) => {
        let member = message.mentions.members.first()
        if(!message.member.hasPermission("MOVE_MEMBERS")) return message.channel.send("Nie możesz użyć tej komendy")
        if(!member) return message.channel.send("Nie oznaczono użytkownika!")
        const {channel} = member.voice;
        if(!channel) return message.channel.send("Użytkownik nie jest na kanale głosowym!")
        member.voice.kick();
        return message.channel.send("Wyrzucono " + member.user.username + " z kanału głosowego")
    }
}