const discord = require("discord.js")
const db = require("quick.db")

const delay = (msec) => new Promise((resolve) => setTimeout(resolve, msec));

module.exports =  {
    name: 'setprefix',
    aliases: ["prefix", "sp"],
    category: 'Moderation',
    usage: 'setprefix <new_prefix>',
    description: 'Change prefix',
    run: async (client, message, args) => {

        if(!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(" You need Administrator permission")
        }

        if(!args[0]) {
            return message.channel.send('Please give the prefix you want to set')
        }
        if(args[1]) {
            return channel.message.send("You can't set prefix with a double argument")
        }
        if(args[0].lenght > 3) {
            return channel.message.send("You can't set prefix that's longer than 3 characters")

        }
        db.set(`prefix_${message.guild.id}`, args[0])
        await message.channel.send(`Prefix set to ${args[0]}`)
    }
}