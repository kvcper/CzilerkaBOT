const discord = require("discord.js")


module.exports = {
    name: "clear",
    triggers: [
		["clear"],
	],
    run: async (client, message, args) => {
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Nie, nie, nie, nie możesz użyć tej komendy")
        let amount = parseInt(args[0])
        if(isNaN(amount)) return message.channel.send("Podana ilość wiadomości nie jest prawidłowa!")
        if(amount < 101) {
            message.channel.bulkDelete(amount)
            return;
        }
        let amount2
        if(amount > 100) {
           amount2 = amount /100
        }
        for(let i = 0; i < amount2; i++) {
            if(amount < 1 ) return;
            if(amount > 100) {
            message.channel.bulkDelete(100)
            }
            if(amount < 101) {
                message.channel.bulkDelete(amount)
            }
            amount = amount - 100
        }
    }
}