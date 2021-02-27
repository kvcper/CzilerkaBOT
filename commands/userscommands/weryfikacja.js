const discord = require("discord.js")
const db = require("quick.db")

module.exports = {
    name: "weryfikacja",
    run: async (client, message, args) => {
        if(!message.member.hasPermission(`ADMINISTRATOR`))return
        if (args[0] == `stworz`) {
            if (db.get(`weryfikacja_${message.guild.id}`)) {
                return message.channel.send(`weryfikacja na tym serwerze juz istnieje! spróbuj ją usunąć`)
            } else {
                if (!args[1]) return message.channel.send(`Podaj id kanalu!`)
                let kanal = message.guild.channels.cache.find(x => x.id === args[1])
                if (!kanal) return message.channel.send(`Nie znaleziono kanału!`)
                if (!args[2]) return message.channel.send(`Podaj id wiadomosci!`)
                let wiadomosc = await kanal.messages.fetch(args[2])
                if (!wiadomosc) return message.channel.send(`Nie znaleziono wiadomosci!`)
                if (!args[3]) return message.channel.send(`Podaj id roli!`)
                let rola = message.guild.roles.cache.find(x => x.id === args[3])
                if (!rola) return message.channel.send(`Nie znaleziono roli!`)
                let msg = await message.channel.send(`Zareaguj na tą wiadomość emoji!`);
                let reaction = await msg
                    .awaitReactions((reaction, user) => user.id == message.author.id, {
                        max: 1,
                        time: 60000,
                        errors: ["time"]
                    })
                    .catch(async time => {
                        msg.edit(`nie zareagowałeś! Menu wygasło!`);
                        msg.delete({ timeout: 5000 });
                        return;
                    });
                reaction = await reaction.first();
                let checkReaction =
                    client.emojis.cache.find(x => x.id == reaction.emoji.id) ||
                    client.emojis.cache.find(x => x.name == reaction.emoji.name);
                let check = false;
                check = reaction.emoji.id ? checkReaction : true;
                if (!check) {
                    return message.chanel.send(`Bot nie znalazł takiego emoji!`)
                }
                message.channel.send(`Stworzono weryfikacje!`)
                let weryfikacja = {
                    kanal: kanal.id,
                    wiadomosc: wiadomosc.id,
                    role: rola.id,
                    custom: reaction.emoji.id ? true : false,
                    reaction: reaction.emoji.id ? reaction.emoji.id : reaction.emoji.name,
                    emoji: reaction.emoji.animated
                        ? `<a:${reaction.emoji.name}:${reaction.emoji.id}>`
                        : `<:${reaction.emoji.name}:${reaction.emoji.id}>`
                };
                let wermessage = await kanal.messages.fetch(args[2])
                if(!wermessage) return message.channel.send(`blad`)
                wermessage.react(weryfikacja.reaction);
                db.set(`weryfikacja_${message.guild.id}`, weryfikacja)
            }
        }if(args[0] == `usun`) {
            if (db.get(`weryfikacja_${message.guild.id}`)) {
                db.delete(`weryfikacja_${message.guild.id}`)
                return message.channel.send(`Usunięto weryfikacje`)
            } else return message.channel.send(`Na tym serwerze nie ma weryfikacji!`)
        } else return message.channel.send(`weryfikacja stworz/usun`)
    }
}