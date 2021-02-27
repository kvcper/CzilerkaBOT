const discord = require("discord.js")
const db = require("quick.db")
const latinize = require("latinize")

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

module.exports = {
    name: "wycisz",
    triggers: [
        ["mute"],
    ],
    usage: "mute <user> <time>",
    run: async (client, message, args) => {
        message.delete()
        if (!args[0]) {
            let msg = await message.channel.send(`Niepoprawne użycie komendy! Wpisz \`!Wycisz (Tekstowo/Głosowo) (ID/Wzmianka) (Czas xs/xmin/xh/xd) (Powód)\``)
            return msg.delete({ timeout: 5000 });
        }
        if (latinize(args[0]).toLowerCase() == `tekstowo` || latinize(args[0]).toLowerCase() == `text` || latinize(args[0]).toLowerCase() == `t` || latinize(args[0]).toLowerCase() == `chat`) {
            if (!message.member.hasPermission("MANAGE_MESSAGES")) {
                let msg = await message.channel.send(`Nie posiadasz uprawnień do tej komendy!`)
                return msg.delete({ timeout: 5000 });
            }
            let mrole = message.guild.roles.cache.find(r => r.name === 'Muted')
            let mrolecheck = message.guild.roles.cache.find((x) => x.id == mrole.id)
            if (!mrolecheck) mrole = null
            const embed = new discord.MessageEmbed()
                .setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
                .setColor('#fcb030')
            if (mrole === null) {
                let msg = await message.channel.send(`Nie znaleziono roli!`)
                return msg.delete({ timeout: 5000 });
            }
            var reason = args.slice(3).join(' ')
            if (!reason) reason = 'Brak powodu'
            const mMember = message.mentions.members.first() || message.guild.members.cache.get(args[1])
            if (!mMember) {
                let msg = await message.channel.send(`Nie znaleziono podanego użytkownika!`)
                return msg.delete({ timeout: 5000 });
            }
            const amount = parseInt(args[2])
            if (isNaN(amount)) {
                let msg = await message.channel.send(`Nie podano czasu!`)
                return msg.delete({ timeout: 5000 });
            }
            if (mMember.roles.cache.has(mrolecheck.id)) {
                let msg = await message.channel.send(`Ta osoba jest już wyciszona`)
                return msg.delete({ timeout: 5000 });
            }
            embed.setTitle(`Wyciszono na czacie tekstowym!`)
            embed.setThumbnail(mMember.user.avatarURL({ dynamic: true }))
            if (args[2] === amount + "s") {
                embed.setDescription(`**Rodzaj wyciszenia**
>  \`Wyciszono tekstowo\`
                
Wyciszenie zostało nadane przez:
>  ${message.member}
                
**Czas Kary:**
>   \`${amount + "s"}\`
                
Użytkownik:
>  ${mMember}
                
**Powód wyciszenia:**
>  \`${reason}\``)
                await mMember.roles.add(mrolecheck.id)
                await message.delete()
                await message.channel.send(embed)
                await mMember.send(embed)

                let mutetime = db.get(`mute_time_${message.guild.id}_${mMember.id}`)
                if (mutetime == null) {
                    db.set(`mute_time_${message.guild.id}_${mMember.id}`, (Math.floor(Date.now() + (amount * 1000))))
                }
                db.set(`mute_time_${message.guild.id}_${mMember.id}`, (Math.floor(Date.now() + (amount * 1000))))
                db.set(`unmut_${mMember.id}`, amount + "s")
                return await mMember.send(`Jeżeli twierdzisz że twoja kara jest niesłuszna skontaktuj sie z nami na naszym serwerze support: \nhttps://discord.gg/QrcDYsfcBU`)
            }
            if (args[2] === amount + "min") {
                embed.setDescription(`**Rodzaj odciszenia**
>  \`Wyciszono tekstowo\`
                
Wyciszenie zostało nadane przez:
>  ${message.member}
                
**Czas Kary:**
>   \`${amount + "min"}\`
                
Użytkownik:
>  ${mMember}
                
**Powód wyciszenia:**
>  \`${reason}\``)
                await mMember.roles.add(mrolecheck.id)
                await message.channel.send(embed)
                await mMember.send(embed)

                let mutetime = db.get(`mute_time_${message.guild.id}_${mMember.id}`)
                if (mutetime == null) {
                    db.set(`mute_time_${message.guild.id}_${mMember.id}`, (Math.floor(Date.now() + (amount * 60 * 1000))))
                }
                db.set(`mute_time_${message.guild.id}_${mMember.id}`, (Math.floor(Date.now() + (amount * 60 * 1000))))
                db.set(`unmut_${mMember.id}`, amount + "min")
                await await mMember.send(`Jeżeli twierdzisz że twoja kara jest niesłuszna skontaktuj sie z nami na naszym serwerze support: \nhttps://discord.gg/QrcDYsfcBU`)
                return
            }
            if (args[2] === amount + "h") {
                embed.setDescription(`**Rodzaj odciszenia**
>  \`Wyciszono tekstowo\`
                
Wyciszenie zostało nadane przez:
>  ${message.member}
                
**Czas Kary:**
                >   \`${amount + "h"}\`
                
Użytkownik:
>  ${mMember}
                
**Powód wyciszenia:**
>  \`${reason}\``)
                await mMember.roles.add(mrolecheck.id)
                await message.delete()
                await message.channel.send(embed)
                await mMember.send(embed)

                let mutetime = db.get(`mute_time_${message.guild.id}_${mMember.id}`)
                if (mutetime == null) {
                    db.set(`mute_time_${message.guild.id}_${mMember.id}`, (Math.floor(Date.now() + (amount * 60 * 60 * 1000))))
                }
                db.set(`mute_time_${message.guild.id}_${mMember.id}`, (Math.floor(Date.now() + (amount * 60 * 60 * 1000))))
                db.set(`unmut_${mMember.id}`, amount + "h")
                return await mMember.send(`Jeżeli twierdzisz że twoja kara jest niesłuszna skontaktuj sie z nami na naszym serwerze support: \nhttps://discord.gg/QrcDYsfcBU`)
            }
            if (args[2] === amount + "d") {
                embed.setDescription(`**Rodzaj odciszenia**
>  \`Wyciszono tekstowo\`
                
Wyciszenie zostało nadane przez:
>  ${message.member}
                
**Czas Kary:**
>   \`${amount + "d"}\`
                
Użytkownik:
>  ${mMember}
                
**Powód wyciszenia:**
>  \`${reason}\``)
                await mMember.roles.add(mrolecheck.id)
                await message.delete()
                await message.channel.send(embed)
                await mMember.send(embed)

                let mutetime = db.get(`mute_time_${message.guild.id}_${mMember.id}`)
                if (mutetime == null) {
                    db.set(`mute_time_${message.guild.id}_${mMember.id}`, (Math.floor(Date.now() + (amount * 24 * 60 * 60 * 1000))))
                }
                db.set(`mute_time_${message.guild.id}_${mMember.id}`, (Math.floor(Date.now() + (amount * 24 * 60 * 60 * 1000))))
                db.set(`unmut_${mMember.id}`, amount + "d")
                return mMember.send(`Jeżeli twierdzisz że twoja kara jest niesłuszna skontaktuj sie z nami na naszym serwerze support: \nhttps://discord.gg/QrcDYsfcBU`)
            }
            else message.channel.send("Podałeś nieprawidłowy argument,\n`s` - dla sekund\n`min` - dla minut\n`h` - dla godzin\n\`d\` - dla dni")
        } if (latinize(args[0]).toLowerCase() == `glosowo` || latinize(args[0]).toLowerCase() == `voice` || latinize(args[0]).toLowerCase() == `v` || latinize(args[0]).toLowerCase() == `glosowy`) {
            if (!message.member.hasPermission("MANAGE_MESSAGES")) {
                let msg = await message.channel.send(`Nie posiadasz uprawnień do tej komendy!`)
                return msg.delete({ timeout: 5000 });
            }
            const mMember = message.mentions.members.first() || message.guild.members.cache.get(args[1])
            if (!mMember) {
                let msg = await message.channel.send(`Nie znaleziono podanego użytkownika!`)
                return msg.delete({ timeout: 5000 });
            }
            const { channel } = mMember.voice;
            if (!channel) {
                let msg = await message.channel.send(`Podany użytkownika nie jest na kanale głosowym!`)
                return msg.delete({ timeout: 5000 });
            }
            const amount = parseInt(args[2])
            if (isNaN(amount)) {
                let msg = await message.channel.send(`Nie podano czasu!`)
                return msg.delete({ timeout: 5000 });
            }
            const embed = new discord.MessageEmbed()
                .setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
                .setColor('#fcb030')
            var reason = args.slice(3).join(' ')
            if (!reason) reason = 'Brak powodu'
            embed.setTitle(`Wyciszono na czacie głosowym!`)
            mMember.voice.setMute(true)
            embed.setThumbnail(mMember.user.avatarURL({ dynamic: true }))
            if (args[2] === amount + "s") {
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
                db.set(`vmute_${mMember.id}`, amount + "s")
                return await mMember.send(embed).then(() => mMember.send(`Jeżeli twierdzisz że twoja kara jest niesłuszna skontaktuj sie z nami na naszym serwerze support: \nhttps://discord.gg/QrcDYsfcBU`))
            }
            if (args[2] === amount + "min") {
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



                let vcmutetime = db.get(`vcmute_time_${message.guild.id}_${mMember.id}`)
                if (vcmutetime == null) {
                    db.set(`vcmute_time_${message.guild.id}_${mMember.id}`, (Math.floor(Date.now() + (amount * 60 * 1000))))
                }
                db.set(`vcmute_time_${message.guild.id}_${mMember.id}`, (Math.floor(Date.now() + (amount * 60 * 1000))))
                db.set(`vmute_${mMember.id}`, amount + "min")
                return await mMember.send(embed).then(() => mMember.send(`Jeżeli twierdzisz że twoja kara jest niesłuszna skontaktuj sie z nami na naszym serwerze support: \nhttps://discord.gg/QrcDYsfcBU`))
            }
            if (args[2] === amount + "h") {
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
                db.set(`vmute_${mMember.id}`, amount + "h")
                return await mMember.send(embed).then(() => mMember.send(`Jeżeli twierdzisz że twoja kara jest niesłuszna skontaktuj sie z nami na naszym serwerze support: \nhttps://discord.gg/QrcDYsfcBU`))
            }
            if (args[2] === amount + "d") {
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
                db.set(`vmute_${mMember.id}`, amount + "d")
                return await mMember.send(embed).then(() => mMember.send(`Jeżeli twierdzisz że twoja kara jest niesłuszna skontaktuj sie z nami na naszym serwerze support: \nhttps://discord.gg/QrcDYsfcBU`))
            }
            else {
                let msg = await message.channel.send(`Niepoprawne użycie komendy! Wpisz \`!Wycisz (Tekstowo/Głosowo) (ID/Wzmianka) (Czas xs/xmin/xh/xd) (Powód)\``)
                msg.delete({ timeout: 5000 });
            }
        } else {
            let msg = await message.channel.send(`Niepoprawne użycie komendy! Wpisz \`!Wycisz (Tekstowo/Głosowo) (ID/Wzmianka) (Czas xs/xmin/xh/xd) (Powód)\``)
            msg.delete({ timeout: 5000 });
        }
        setTimeout(() => {
            mMember.roles.remove(mrole);
        }, ms(mutetime));
    }
}