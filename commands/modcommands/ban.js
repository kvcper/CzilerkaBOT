const discord = require("discord.js")
const db = require("quick.db")

const delay = (msec) => new Promise((resolve) => setTimeout(resolve, msec));


module.exports = {
    name: "ban",
    run: async (client, message, args) => {
        //works lol
        if(message.member.hasPermission("BAN_MEMBERS")||message.member.roles.cache.find(r => r.name === "staff")||message.member.roles.cache.find(r => r.name === "Założyciel serwera")||message.member.roles.cache.find(r => r.name === "HeadMod")||message.member.roles.cache.find(r => r.name === "Support Team")||message.member.roles.cache.find(r => r.name === "Admin")||message.member.roles.cache.find(r => r.name === "Moderator")||message.member.roles.cache.find(r => r.name === "Kacpra Boty")||message.member.roles.cache.find(r => r.name === "Właścicielka")){
            let member = message.mentions.members.first()
            if (!member)
                member = message.guild.members.cache.get(args[0])
                console.log(`id`)
            if (!member)
                return message.channel.send("Nie podałeś użytkownika")
            if (member.user.id == message.guild.ownerID)
                return message.channel.send("Nie możesz zbanować właściciela!")
            const amount = parseInt(args[1])
            if (args[1] === amount + "s") {
                console.log(`s`)
                let reason = args.slice(2).join(" ")
                if (!reason) {
                    reason = "Bez wyraźnego powodu"
                }
                const embed2 = new discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true, size: 64 }))
                    .setTitle("Link do serwera na którym możesz się odwołać")
                    .setURL('https://discord.gg/QrcDYsfcBU')
                    .setColor("RED")
                    .addFields(
                        { name: "Moderator", value: message.author },
                        { name: "Użytkownik", value: member.user, inline: true },
                        { name: "Powód", value: reason, inline: true },
                        { name: "Czas", value: amount + "s", inline: true }
                    )
                const embed = new discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true, size: 64 }))
                    .setTitle("Zbanowano " + member.user.username, member.user.avatarURL({ dynamic: true, size: 64 }))
                    .setColor("RED")
                    .setTimestamp(Date.now())
                    .setThumbnail(member.user.avatarURL({ dynamic: true }))
                    .addFields(
                        { name: message.member.roles.highest.name, value: message.author, },
                        { name: "Użytkownik", value: member.user, inline: true },
                        { name: '\u200b', value: '\u200b', inline: true },
                        { name: "Powód", value: reason, inline: true },
                        { name: "Czas", value: amount + "s", inline: true }
                    )
                if (!message.member.roles.highest.comparePositionTo(member.roles.highest) > 0) return message.channel.send("Nie możesz zbanować kogoś z wyższą lub taką samą rolą")
                //await member.send(embed2)
                message.delete()
                await member.send({ embed: embed }).then(() => member.send(`Jeżeli twierdzisz że twoja kara jest niesłuszna skontaktuj sie z nami na naszym serwerze support: \nhttps://discord.gg/QrcDYsfcBU`))
                member.ban({ reason: reason }).catch(error => message.channel.send("Nie można zbanować użytkownika\n " + error))
                message.channel.send(embed)
                let bantime = db.get(`ban_time_${message.guild.id}_${member.id}`)
                if (bantime == null) {
                    db.set(`ban_time_${message.guild.id}_${member.id}`, (Math.floor(Date.now() + (amount * 1000))))
                }
                return db.set(`ban_time_${message.guild.id}_${member.id}`, (Math.floor(Date.now() + (amount * 1000))))
            } if (args[1] === amount + "min") {
                console.log(`min`)
                let reason = args.slice(2).join(" ")
                if (!reason) {
                    reason = "Bez wyraźnego powodu"
                }
                const embed2 = new discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true, size: 64 }))
                    .setTitle("Link do serwera na którym możesz się odwołać")
                    .setURL('https://discord.gg/QrcDYsfcBU')
                    .setColor("RED")
                    .addFields(
                        { name: "Moderator", value: message.author },
                        { name: "Użytkownik", value: member.user, inline: true },
                        { name: "Powód", value: reason, inline: true },
                        { name: "Czas", value: amount + "min", inline: true }
                    )
                const embed = new discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true, size: 64 }))
                    .setTitle("Zbanowano " + member.user.username, member.user.avatarURL({ dynamic: true, size: 64 }))
                    .setColor("RED")
                    .setTimestamp(Date.now())
                    .setThumbnail(member.user.avatarURL({ dynamic: true }))
                    .addFields(
                        { name: message.member.roles.highest.name, value: message.author, },
                        { name: "Użytkownik", value: member.user, inline: true },
                        { name: '\u200b', value: '\u200b', inline: true },
                        { name: "Powód", value: reason, inline: true },
                        { name: "Czas", value: amount + "min", inline: true }
                    )
                if (!message.member.roles.highest.comparePositionTo(member.roles.highest) > 0) return message.channel.send("Nie możesz zbanować kogoś z wyższą lub taką samą rolą")
                //await member.send(embed2)
                message.delete()
                await member.send({ embed: embed }).then(() => member.send(`Jeżeli twierdzisz że twoja kara jest niesłuszna skontaktuj sie z nami na naszym serwerze support: \nhttps://discord.gg/QrcDYsfcBU`))
                member.ban({ reason: reason }).catch(error => message.channel.send("Nie można zbanować użytkownika\n " + error))
                message.channel.send(embed)
                let bantime = db.get(`ban_time_${message.guild.id}_${member.id}`)
                if (bantime == null) {
                    db.set(`ban_time_${message.guild.id}_${member.id}`, (Math.floor(Date.now() + (amount * 60 * 1000))))
                }
                return db.set(`ban_time_${message.guild.id}_${member.id}`, (Math.floor(Date.now() + (amount * 60 * 1000))))
            } if (args[1] === amount + "h") {
                console.log(`h`)
                let reason = args.slice(2).join(" ")
                if (!reason) {
                    reason = "Bez wyraźnego powodu"
                }
                const embed2 = new discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true, size: 64 }))
                    .setTitle("Link do serwera na którym możesz się odwołać")
                    .setURL('https://discord.gg/QrcDYsfcBU')
                    .setColor("RED")
                    .addFields(
                        { name: "Moderator", value: message.author },
                        { name: "Użytkownik", value: member.user, inline: true },
                        { name: "Powód", value: reason, inline: true },
                        { name: "Czas", value: amount + "h", inline: true }
                    )
                const embed = new discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true, size: 64 }))
                    .setTitle("Zbanowano " + member.user.username, member.user.avatarURL({ dynamic: true, size: 64 }))
                    .setColor("RED")
                    .setTimestamp(Date.now())
                    .setThumbnail(member.user.avatarURL({ dynamic: true }))
                    .addFields(
                        { name: message.member.roles.highest.name, value: message.author, },
                        { name: "Użytkownik", value: member.user, inline: true },
                        { name: '\u200b', value: '\u200b', inline: true },
                        { name: "Powód", value: reason, inline: true },
                        { name: "Czas", value: amount + "h", inline: true }
                    )
                if (!message.member.roles.highest.comparePositionTo(member.roles.highest) > 0) return message.channel.send("Nie możesz zbanować kogoś z wyższą lub taką samą rolą")
                //await member.send(embed2)
                message.delete()
                await member.send({ embed: embed }).then(() => member.send(`Jeżeli twierdzisz że twoja kara jest niesłuszna skontaktuj sie z nami na naszym serwerze support: \nhttps://discord.gg/QrcDYsfcBU`))
                member.ban({ reason: reason }).catch(error => message.channel.send("Nie można zbanować użytkownika\n " + error))
                message.channel.send(embed)
                let bantime = db.get(`ban_time_${message.guild.id}_${member.id}`)
                if (bantime == null) {
                    db.set(`ban_time_${message.guild.id}_${member.id}`, (Math.floor(Date.now() + (amount * 60 * 60 * 1000))))
                }
                return db.set(`ban_time_${message.guild.id}_${member.id}`, (Math.floor(Date.now() + (amount * 60 * 60 * 1000))))
            } if (args[1] === amount + "d") {
                console.log(`d`)
                let reason = args.slice(2).join(" ")
                if (!reason) {
                    reason = "Bez wyraźnego powodu"
                }
                const embed2 = new discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true, size: 64 }))
                    .setTitle("Link do serwera na którym możesz się odwołać")
                    .setURL('https://discord.gg/QrcDYsfcBU')
                    .setColor("RED")
                    .addFields(
                        { name: "Moderator", value: message.author },
                        { name: "Użytkownik", value: member.user, inline: true },
                        { name: "Powód", value: reason, inline: true },
                        { name: "Czas", value: amount + "d", inline: true }
                    )
                const embed = new discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true, size: 64 }))
                    .setTitle("Zbanowano " + member.user.username, member.user.avatarURL({ dynamic: true, size: 64 }))
                    .setColor("RED")
                    .setTimestamp(Date.now())
                    .setThumbnail(member.user.avatarURL({ dynamic: true }))
                    .addFields(
                        { name: message.member.roles.highest.name, value: message.author, },
                        { name: "Użytkownik", value: member.user, inline: true },
                        { name: '\u200b', value: '\u200b', inline: true },
                        { name: "Powód", value: reason, inline: true },
                        { name: "Czas", value: amount + "d", inline: true }
                    )
                if (!message.member.roles.highest.comparePositionTo(member.roles.highest) > 0) return message.channel.send("Nie możesz zbanować kogoś z wyższą lub taką samą rolą")
                //await member.send(embed2)
                message.delete()
                await member.send({ embed: embed }).then(() => member.send(`Jeżeli twierdzisz że twoja kara jest niesłuszna skontaktuj sie z nami na naszym serwerze support: \nhttps://discord.gg/QrcDYsfcBU`))
                member.ban({ reason: reason }).catch(error => message.channel.send("Nie można zbanować użytkownika\n " + error))
                message.channel.send(embed)
                let bantime = db.get(`ban_time_${message.guild.id}_${member.id}`)
                if (bantime == null) {
                    db.set(`ban_time_${message.guild.id}_${member.id}`, (Math.floor(Date.now() + (amount * 24 * 60 * 60 * 1000))))
                }
                return db.set(`ban_time_${message.guild.id}_${member.id}`, (Math.floor(Date.now() + (amount * 24 * 60 * 60 * 1000))))
            } else {
                console.log(`forever`)
                let reason = args.slice(1).join(" ")
                if (!reason) {
                    reason = "Bez wyraźnego powodu"
                }
                const embed2 = new discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true, size: 64 }))
                    .setTitle("Link do serwera na którym możesz się odwołać")
                    .setURL('https://discord.gg/QrcDYsfcBU')
                    .setColor("RED")
                    .addFields(
                        { name: "Moderator", value: message.author },
                        { name: "Użytkownik", value: member.user, inline: true },
                        { name: "Powód", value: reason, inline: true },
                        { name: "Czas", value: "Na zawsze", inline: true }
                    )
                const embed = new discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true, size: 64 }))
                    .setTitle("Zbanowano " + member.user.username, member.user.avatarURL({ dynamic: true, size: 64 }))
                    .setColor("RED")
                    .setTimestamp(Date.now())
                    .setThumbnail(member.user.avatarURL({ dynamic: true }))
                    .addFields(
                        { name: message.member.roles.highest.name, value: message.author, },
                        { name: "Użytkownik", value: member.user, inline: true },
                        { name: '\u200b', value: '\u200b', inline: true },
                        { name: "Powód", value: reason, inline: true },
                        { name: "Czas", value: "Na zawsze", inline: true }
                    )
                if (!message.member.roles.highest.comparePositionTo(member.roles.highest) > 0) return message.channel.send("Nie możesz zbanować kogoś z wyższą lub taką samą rolą")
                //await member.send(embed2)
                console.log(`alone`)
                message.delete()
                member.send({ embed: embed }).then(() => member.send(`Jeżeli twierdzisz że twoja kara jest niesłuszna skontaktuj sie z nami na naszym serwerze support: \nhttps://discord.gg/QrcDYsfcBU`))
                await delay(100);
                member.ban({ reason: reason }).catch(error => message.channel.send("Nie można zbanować użytkownika\n " + error))
                return message.channel.send(embed)
            }
        } else {
            return message.channel.send("Nie możesz używać tej komendy")
        }
    }
}