const db = require("quick.db")
const discord = require("discord.js")
module.exports = {
    name: "unvmute",
    triggers: [
        ["unvmute"],
    ],
    aliases: ["vunmute"],
    run: async (client, message, args) => {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Nie możesz tego użyć!")
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!member) return message.channel.send("Nie oznaczono lub nie podano ID użytkownika do odciszenia na kanale!")
        const { channel } = member.voice;
        if (!channel) return message.channel.send("Użytkownik nie jest na kanale głosowym")
        var reason = args.slice(1).join(' ')
        if (!reason) reason = 'Brak powodu'
        member.voice.setMute(false)
        db.delete(`vcmute_time_${message.guild.id}_${member.id}`)
        const embed = new discord.MessageEmbed()
            .setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
            .setColor('#ff4326')
            .setTitle(`Odciszono na czacie głosowym!`)
            .setThumbnail(member.user.avatarURL({ dynamic: true }))
            .setDescription(`**Rodzaj odciszenia**
>  \`Odciszono głosowo\`

Wyciszenie zostało zdjęte przez:
>  ${message.member}

**Czas Kary:**
>   \`${db.get(`vmute_${member.id}`) || `-`}\`

Użytkownik:
>  ${member}

**Powód odciszenia:**
>  \`${reason}\``)
        await message.channel.send(embed)
        await member.send(embed)
    }
}