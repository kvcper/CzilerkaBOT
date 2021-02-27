const db = require("quick.db");
const Discord = require("discord.js");

module.exports = {
    name: "invite",
    aliases: ["zaproszenia", "invites"],
    run: async (client, message, args) => {
        if (!args[0] || args[0] == `me`) {
            let obj = db.get(`invites_${message.member.guild.id}_${message.member.id}`)
			if (!obj) {
				obj = {
					id: message.member.id,
					normal: 0,
					fake: 0,
					left: 0,
					invitedUID: []
                }
                db.set(`invites_${message.member.guild.id}_${message.member.id}`, obj)
			}
            const data = db.get(`invites_${message.guild.id}_${message.author.id}`)
            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setAuthor('Czilerka', client.user.avatarURL())
                .setDescription('**✉️ ┃Twoje invite:**')
                .addFields(
                    { name: '**<:wzrost:782294169883377686>Weszli:**', value: data.normal, inline: true },
                    { name: '**<:fake:782293744141205514>Fake:**', value: data.fake, inline: true },
                    { name: '**<:spadek:782294218840080384>Wyszli:**', value: data.left, inline: true },
                )

            message.channel.send(embed);
        } if (args[0] == `top`) {
            let invite = []
            let lista = ""
            let every = db.all()
                .filter(i => i.ID.startsWith(`invites_${message.guild.id}`))
                .forEach((inv) => {
                    let m = inv.ID.split('_')[2]
                    let g = inv.ID.split('_')[1]
                    let invajt = db.get(`invites_${g}_${m}`)
                    invite.push({ ID: m, liczba: invajt.normal })
                    invite.sort((a, b) => b.liczba - a.liczba)
                })
            for (i = 0; i < 10; i++) {
                if (invite[i])
                    lista += `\`${i + 1}st.\` <@${invite[i].ID}> \`${invite[i].liczba}\` zaproszeń.\n`
            }
            let color = message.guild.members.cache.get(client.user.id).roles.highest.color
            const embed = new Discord.MessageEmbed()
                .setTitle(`Top 10 zaproszonych graczy`)
                .setAuthor('Czilerka zaproszenia', client.user.avatarURL())
                .setDescription(lista)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
                .setThumbnail(message.guild.iconURL({ format: 'png' }))
                .setTimestamp()
                .setColor(color)
            message.channel.send(embed);
        }
    }
}