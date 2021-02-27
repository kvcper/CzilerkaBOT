const Discord = require('discord.js')

module.exports = {
    name: 'avatar',
    triggers: [
		["avatar"],
	],
    run(client, message, args){
        const member = message.mentions.users.first() || client.users.cache.find(u => u.id === args[0])
        if(!member){
            const embed = new Discord.MessageEmbed()
            .setTitle(`Avatar użytkownika ${message.author.username}`)
            .setURL(message.author.avatarURL({dynamic: true, format: "png", size: 4096}))
            .setColor("RANDOM")
            .setImage(message.author.avatarURL({size: 4096, dynamic: true, format: "png"}))
            .setFooter(message.author.username, message.author.avatarURL({dynamic: true}))
            message.channel.send(embed)
            return
        }
        const embed = new Discord.MessageEmbed()
            .setTitle(`Avatar użytkownika ${member.username}`)
            .setURL(member.avatarURL({dynamic: true, size: 4096, format: "png"}))
            .setColor("RANDOM")
            .setImage(member.avatarURL({size: 4096, dynamic: true, format: "png"}))
            .setFooter(message.author.username, message.author.avatarURL({dynamic: true}))
        message.channel.send(embed)
    }
}