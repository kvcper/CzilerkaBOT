const discord = require("discord.js")
const db = require("quick.db")

module.exports = {
    name: "vmute",
    triggers: [
		["vnmute"],
	],
    run: async (client, message, args) => {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Nie możesz tego użyć!")
        const mMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!mMember) return message.channel.send("Nie oznaczono lub nie podano ID użytkownika do wyciszenia na kanale!")
        const {channel} = mMember.voice;
        if(!channel) return message.channel.send("Użytkownik nie jest na kanale głosowym")
        const amount = parseInt(args[1])
        if (isNaN(amount)) return message.channel.send("Podaj czas!")
        const embed = new discord.MessageEmbed()
            .setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
            .setColor('#fcb030')
        var reason = args.slice(2).join(' ')
        if (!reason) reason = 'Brak powodu'
        embed.setTitle(`Wyciszono na czacie głosowym!`)
        mMember.voice.setMute(true)
        embed.setThumbnail(mMember.user.avatarURL({ dynamic: true }))
        if (args[1] === amount + "s") {
            embed.setDescription(`**Rodzaj wyciszenia**
            >  \`Wyciszono głosowo\`
            
            Wyciszenie zostało nadane przez:
            >  ${message.member}
            
            **Czas Kary:**
            >   \`${amount + "s"}\`
            
            Użytkownik:
            >  ${mMember}
            
            **Powód wyciszenia:**
            >  \`${reason}\``)
            message.channel.send(embed)

            await message.delete()

            let vcmutetime = db.get(`vcmute_time_${message.guild.id}_${mMember.id}`)
            if (vcmutetime == null) {
                db.set(`vcmute_time_${message.guild.id}_${mMember.id}`, (Math.floor(Date.now() + (amount * 1000))))
            }
            db.set(`vcmute_time_${message.guild.id}_${mMember.id}`, (Math.floor(Date.now() + (amount * 1000))))
            db.set(`vmute_${mMember.id}`, amount+"s")
        return await mMember.send(embed).then(()=> mMember.send(`Jeżeli twierdzisz że twoja kara jest niesłuszna skontaktuj sie z nami na naszym serwerze support: \nhttps://discord.gg/QrcDYsfcBU`))
        }
        if (args[1] === amount + "min") {
            embed.setDescription(`**Rodzaj wyciszenia**
            >  \`Wyciszono głosowo\`
            
            Wyciszenie zostało nadane przez:
            >  ${message.member}
            
            **Czas Kary:**
            >   \`${amount + "min"}\`
            
            Użytkownik:
            >  ${mMember}
            
            **Powód wyciszenia:**
            >  \`${reason}\``)
            message.channel.send(embed)

            await message.delete()

            let vcmutetime = db.get(`vcmute_time_${message.guild.id}_${mMember.id}`)
            if (vcmutetime == null) {
                db.set(`vcmute_time_${message.guild.id}_${mMember.id}`, (Math.floor(Date.now() + (amount * 60 * 1000))))
            }
            db.set(`vcmute_time_${message.guild.id}_${mMember.id}`, (Math.floor(Date.now() + (amount * 60 * 1000))))
            db.set(`vmute_${mMember.id}`, amount+"min")
        return await mMember.send(embed).then(()=> mMember.send(`Jeżeli twierdzisz że twoja kara jest niesłuszna skontaktuj sie z nami na naszym serwerze support: \nhttps://discord.gg/QrcDYsfcBU`))
        }
        if (args[1] === amount + "h") {
            embed.setDescription(`**Rodzaj wyciszenia**
            >  \`Wyciszono głosowo\`
            
            Wyciszenie zostało nadane przez:
            >  ${message.member}
            
            **Czas Kary:**
            >   \`${amount + "h"}\`
            
            Użytkownik:
            >  ${mMember}
            
            **Powód wyciszenia:**
            >  \`${reason}\``)
            message.channel.send(embed)

            await message.delete()

            let vcmutetime = db.get(`vcmute_time_${message.guild.id}_${mMember.id}`)
            if (vcmutetime == null) {
                db.set(`vcmute_time_${message.guild.id}_${mMember.id}`, (Math.floor(Date.now() + (amount * 60 * 60 * 1000))))
            }
            db.set(`vcmute_time_${message.guild.id}_${mMember.id}`, (Math.floor(Date.now() + (amount * 60 * 60 * 1000))))
            db.set(`vmute_${mMember.id}`, amount+"h")
        return await mMember.send(embed).then(()=> mMember.send(`Jeżeli twierdzisz że twoja kara jest niesłuszna skontaktuj sie z nami na naszym serwerze support: \nhttps://discord.gg/QrcDYsfcBU`))
        }
        if (args[1] === amount + "d") {
            embed.setDescription(`**Rodzaj wyciszenia**
            >  \`Wyciszono głosowo\`
            
            Wyciszenie zostało nadane przez:
            >  ${message.member}
            
            **Czas Kary:**
            >   \`${amount + "d"}\`
            
            Użytkownik:
            >  ${mMember}
            
            **Powód wyciszenia:**
            >  \`${reason}\``)
            message.channel.send(embed)

            await message.delete()

            let vcmutetime = db.get(`vcmute_time_${message.guild.id}_${mMember.id}`)
            if (vcmutetime == null) {
                db.set(`vcmute_time_${message.guild.id}_${mMember.id}`, (Math.floor(Date.now() + (amount * 24 * 60 * 60 * 1000))))
            }
            db.set(`vcmute_time_${message.guild.id}_${mMember.id}`, (Math.floor(Date.now() + (amount * 24 * 60 * 60 * 1000))))
            db.set(`vmute_${mMember.id}`, amount+"d")
        return await mMember.send(embed).then(()=> mMember.send(`Jeżeli twierdzisz że twoja kara jest niesłuszna skontaktuj sie z nami na naszym serwerze support: \nhttps://discord.gg/QrcDYsfcBU`))
        }
        else message.channel.send("Podałeś nieprawidłowy argument,\n`s` - dla sekund\n`min` - dla minut\n`h` - dla godzin\n\`d\` - dla dni")
    }
}