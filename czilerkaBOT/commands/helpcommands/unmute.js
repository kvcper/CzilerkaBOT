const db = require("quick.db")
const discord = require("discord.js")
module.exports = {
    name: "unmute",
    triggers: [
		["unmute"],
	],
    run: async (client, message, args) => {
        return message.channel.send(`Zła komenda! Wpisz \`.mute\``)
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Nie możesz tego użyć!")
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!member) return message.channel.send("Musisz oznaczyć lub podać ID użytkownika")
        let role = message.guild.roles.cache.find(x => x.name === "Muted")
        if (!role) return message.channel.send("Guild nie posiada roli **Muted**")
        if (!member.roles.cache.has(role.id)) return message.channel.send("Użytkownik nie jest wyciszony")
        await member.roles.remove(role.id)

        var reason = args.slice(1).join(' ')
        if (!reason) reason = 'Brak powodu'

        let mutetime = db.get(`mute_time_${message.guild.id}_${member.id}`)
        if (mutetime != null)
            db.delete(`mute_time_${message.guild.id}_${member.id}`)
            const embed = new discord.MessageEmbed()
            .setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
            .setColor('#fcb030')
            .setTitle(`Odciszono na czacie tekstowym!`)
            .setThumbnail(member.user.avatarURL({ dynamic: true }))
            embed.setDescription(`**Rodzaj odciszenia**
            >  \`Odciszono tekstowo\`
            
            Wyciszenie zostało zabrane przez:
            >  ${message.member}
            
            **Czas Kary:**
            >   \`${db.get(`unmut_${member.id}`)}\`
            
            Użytkownik:
            >  ${member}
            
            **Powód odciszenia:**
            >  \`${reason}\``)
            await message.channel.send(embed)

    }
}