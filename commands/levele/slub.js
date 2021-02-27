const db = require("quick.db")
const Discord = require("discord.js")
const fs = require('fs');
var latinize = require('latinize');

Number.isInteger = Number.isInteger || function (value) {
    return typeof value === 'number' &&
        isFinite(value) &&
        Math.floor(value) === value;
};

function toLower(text) {
    return text.toLowerCase();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const delay = (msec) => new Promise((resolve) => setTimeout(resolve, msec));

module.exports = {
    name: "menu",
    run: async (client, message, args) => {
        if (latinize(args[0]).toLowerCase() == `slub` || latinize(args[0]).toLowerCase() == `slubu`) {
            if (!args[1]) {
                let embed = new Discord.MessageEmbed()
                    .setAuthor('Czilerka', client.user.avatarURL())
                    .setTitle(`Menu ślubu`)
                    .setThumbnail(`https://media.giphy.com/media/ifB1v1W3Db0GIW7uTA/giphy.gif`)
                    .setColor("ff6fe7")
                    .setDescription(`
💞**┃Jeżeli chcesz poślubić swoją miłość Discordową wpisz:**
\`-\` !slub poslub [@osoba]    
                
💔**┃Jeżeli chcesz rozwieść sie z swoją Discordową miłośćią wpisz:**
\`-\` !slub rozwod
                
❤️**┃Ustawienie czy posiadasz ślub (płci):**
\`-\` !slub rola [mąż/żona]

❣️**┃Pozwala sprawdzić czy jesteś poślubiony:**
\`-\` !slub status`)

                return message.channel.send(embed)
            }
            if (toLower(latinize(args[1])) == `poslub`) {
                let member = message.mentions.members.first()
                if (!member) return message.channel.send(`Oznacz uzytkownika`)
                if (member == message.member) return message.channel.send(`nie mozesz wziac slubu z samym soba`)
                if (db.get(`slubtime_${message.guild.id}_${member.id}`)) return message.channel.send(`Ten uzytkownim ma juz oferte slubu rozwalencu`)
                if (db.get(`slub_${message.guild.id}_${member.id}`)) return message.channel.send(`Ten ktos jest juz poslubiony`)
                if (db.get(`slub_${message.guild.id}_${message.member.id}`)) return message.channel.send(`Jestes juz poslubiony`)
                let embed = new Discord.MessageEmbed()
                    .setAuthor('Czilerka', client.user.avatarURL())
                    .setTitle(`Oświadczyłeś/aś się!`)
                    .setColor("ff6fe7")
                    .setThumbnail(`https://media.giphy.com/media/ifB1v1W3Db0GIW7uTA/giphy.gif`)
                    .setDescription(`Osoba którą chcesz wziąć za swoją wieczną miłość Discordową musi napisać na tym kanale **Zgadzam sie** (w ciągu 30s)`)
                message.channel.send(embed)
                db.set(`slubtime_${message.guild.id}_${member.id}`, message.member.id)
                setTimeout(function () {
                    db.delete(`slubtime_${message.guild.id}_${member.id}`)
                }, 30000);
            } if (toLower(latinize(args[1])) == `rozwod`) {
                if (!db.get(`slub_${message.guild.id}_${message.member.id}`)) return message.channel.send(`Nie jestes poslubiony`)
                let poslubiony = (db.get(`slub_${message.guild.id}_${message.member.id}`)).poslubiony
                db.delete(`slub_${message.guild.id}_${message.member.id}`)
                db.delete(`slub_${message.guild.id}_${poslubiony}`)
                let embed = new Discord.MessageEmbed()
                    .setAuthor('Czilerka', client.user.avatarURL())
                    .setTitle(`Rozwiodłeś/aś się!`)
                    .setColor("ff6fe7")
                    .setDescription(`Właśnie rozpadł się związek małżeński!`)
                    .setThumbnail(`https://media.giphy.com/media/ifB1v1W3Db0GIW7uTA/giphy.gif`)
                return message.channel.send(embed)
            } if (toLower(latinize(args[1])) == `status`) {
                if (!db.get(`slub_${message.guild.id}_${message.member.id}`)) return message.channel.send(`Nie jestes poslubiony`)
                let poslubiony = (db.get(`slub_${message.guild.id}_${message.member.id}`)).poslubiony
                let embed = new Discord.MessageEmbed()
                    .setAuthor('Czilerka', client.user.avatarURL())
                    .setTitle(`Status związku`)
                    .setColor("ff6fe7")
                    .setDescription(`${message.member} - \`${(db.get(`slub_${message.guild.id}_${message.member.id}`)).rola ? (db.get(`slub_${message.guild.id}_${message.member.id}`)).rola : `Nie wybrano roli męża lub żony!`}\`
<@${poslubiony}> - \`${(db.get(`slub_${message.guild.id}_${poslubiony}`)).rola ? (db.get(`slub_${message.guild.id}_${poslubiony}`)).rola : `Nie wybrano roli męża lub żony!`}\``)
                    .setThumbnail(`https://media.giphy.com/media/ifB1v1W3Db0GIW7uTA/giphy.gif`)
                return message.channel.send(embed)
            } if (toLower(latinize(args[1])) == `rola`) {
                if(!args[2]){
                    let embed = new Discord.MessageEmbed()
                        .setAuthor('Czilerka', client.user.avatarURL())
                        .setTitle(`Status związku`)
                        .setColor("ff6fe7")
                        .setDescription(`Musisz wybrać rolę \`Mąż\` lub \`Żona\``)
                        .setThumbnail(`https://media.giphy.com/media/ifB1v1W3Db0GIW7uTA/giphy.gif`)
                    return message.channel.send(embed)
                }
                if (toLower(latinize(args[2])) == `maz`) {
                    if (!db.get(`slub_${message.guild.id}_${message.member.id}`)) return message.channel.send(`Nie jestes poslubiony`)
                    let slub = db.get(`slub_${message.guild.id}_${message.member.id}`)
                    slub.rola = `Mąż`
                    db.set(`slub_${message.guild.id}_${message.member.id}`, slub)
                    let embed = new Discord.MessageEmbed()
                        .setAuthor('Czilerka', client.user.avatarURL())
                        .setTitle(`Status związku`)
                        .setColor("ff6fe7")
                        .setDescription(`Wybrano rolę \`Mąż\` w związku!`)
                        .setThumbnail(`https://media.giphy.com/media/ifB1v1W3Db0GIW7uTA/giphy.gif`)
                    return message.channel.send(embed)
                } if (toLower(latinize(args[2])) == `zona`) {
                    if (!db.get(`slub_${message.guild.id}_${message.member.id}`)) return message.channel.send(`Nie jestes poslubiony`)
                    let slub = db.get(`slub_${message.guild.id}_${message.member.id}`)
                    slub.rola = `Żona`
                    db.set(`slub_${message.guild.id}_${message.member.id}`, slub)
                    let embed = new Discord.MessageEmbed()
                        .setAuthor('Czilerka', client.user.avatarURL())
                        .setTitle(`Status związku`)
                        .setColor("ff6fe7")
                        .setDescription(`Wybrano rolę \`Żona\` w związku!`)
                        .setThumbnail(`https://media.giphy.com/media/ifB1v1W3Db0GIW7uTA/giphy.gif`)
                    return message.channel.send(embed)
                } else {
                    let embed = new Discord.MessageEmbed()
                        .setAuthor('Czilerka', client.user.avatarURL())
                        .setTitle(`Status związku`)
                        .setColor("ff6fe7")
                        .setDescription(`Musisz wybrać rolę \`Mąż\` lub \`Żona\``)
                        .setThumbnail(`https://media.giphy.com/media/ifB1v1W3Db0GIW7uTA/giphy.gif`)
                    return message.channel.send(embed)
                }
            }
        }
    }
}