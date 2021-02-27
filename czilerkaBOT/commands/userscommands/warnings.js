const db = require("quick.db")
const discord = require("discord.js")
const embed = new discord.MessageEmbed()
    .setTimestamp()
const {pages} = require('../../handlers/pages')
module.exports = {
    name: "warnings",
    triggers: [
		["warnings"],
	],
    run: async (client, message, args) => {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        let warning = db.get(`warnings_${message.guild.id}`)
        if(warning == null) return message.channel.send("")
        if(warning.length < 1) return message.channel.send("Użytkownik nie posiada żadnych ostrzeżeń")
        let warningsArr = [];
        for(let i = 0; i < warning.length; i++) {
            if(warning[i] == null)continue
            else {
                warningsArr.push(`ID: **${warning[i].id}**\nPowód: \`\`\`${warning[i].reason}\`\`\``)
                continue
            }
        }
        let arr = []
        if(member){
            for (let i = 0; i< warning.length; i++) {
                if(warning[i] == null)continue
                if(warning[i].user != null && warning[i].user == member.user.id){
                    arr.push(`Zwarnowano przez: \`${warning[i].moderator}\`\nID: ${warning[i].id}\nPowód: \`\`\`${warning[i].reason}\`\`\``)
                }
            }
            var page = args[1]
            if(!args[1])page = 1
            if(args[1] && isNaN(args[1]))return message.channel.send(`Podaj liczbowy argument`)
            let p = pages(arr, 20, page)
            if(p == null)embed.setDescription('Użytkownik nie ma ostrzeżeń')
            else if(p != null)embed.setDescription(p.join('\n\n'))
            embed.setFooter(`Na życzenie ${message.author.username}`, message.author.avatarURL({dynamic: true}))
            embed.setAuthor(`Ostrzeżenia użytkownika ${member.user.username}`, member.user.avatarURL({dynamic: true}))
            return message.channel.send(embed)
        }
        if(!member){
            page = args[0]
            if(!args[0])page = 1
            if(args[0] && isNaN(args[1]))return message.channel.send(`Podaj liczbowy argument`)
            let p = pages(warningsArr,20,page)
            embed.setDescription(p.join('\n\n'))
            embed.setAuthor(`Ostrzeżenia serwera ${message.guild.name}`, message.guild.iconURL({dynamic: true}))
            embed.setFooter(`Na życzenie ${message.author.username}`, message.author.avatarURL({dynamic: true}))
            message.channel.send(embed)
        }
    }
}