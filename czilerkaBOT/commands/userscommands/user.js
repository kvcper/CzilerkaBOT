const Discord = require('discord.js')
const moment = require('moment-timezone')
const db = require('quick.db')
const fs = require("fs")
const levele = JSON.parse(fs.readFileSync("./Config/levele.json", "utf8"));

module.exports = {
    name: "user",
    triggers: [
        ["user"],
    ],
    description: "Shows info about you/provided user.",
    usage: "(@user/user ID)",
    async run(client, message, args) {
        var levele = new db.table('levele')
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        var nickname = member.nickname
        if (nickname === null) nickname = 'Brak nicku'
        var status = member.user.presence.activities[0]
        if (status === undefined) status = `Brak statusu`
        else if (status !== undefined) status = status.state

        let warning = db.get(`warnings_${message.guild.id}`)
        var ilosc = 0;
        if (warning) {
            for (let i = 0; i < warning.length; i++) {
                if (warning[i] == null) continue
                if (warning[i].user != null && warning[i].user == message.member.user.id) {
                    ilosc++
                }
            }
        }


        moment.locale(`pl`);
        let levelObj = levele.get(`level_${message.guild.id}_${member.id}`);
        if (!levelObj) {
            levelObj = {
                level: 0,
                TextXP: 0,
                ReqTextXP: levele[1],
                levelVC: 0,
                VCXP: 0,
                ReqVCXP: levele[1],
                rep: 0
            };
            levele.set(`level_${message.guild.id}_${member.id}`, levelObj);
            levelObj = levele.get(`level_${message.guild.id}_${member.id}`);
            levele.set(`GlobalTextXP_${message.guild.id}_${member.id}`, 0);
            levele.set(`GlobalVCXP_${message.guild.id}_${member.id}`, 0);
        }
        let userinfo = levele.get(`userinfo_${member.id}`)
        if (!userinfo) {
            userinfo = {
                imie: "-",
                wiek: "-",
                wojewodztwo: "-",
                email: "-",
                plec: "-",
                data: "-",
                wzrost: "-",
                zainteresowania: "-"
            }
        }
        const embed = new Discord.MessageEmbed()
            .setDescription(`
        **__Informacje Użytkownika:__**
<a:piesek:813090212502306836>┃Imie: **${userinfo.imie}**
<a:mm:813090212732993556>┃Wiek: **${userinfo.wiek}**
<:www:810896578189459517>┃Województwo: **${userinfo.wojewodztwo}**
<:mail:813090210626666506>┃Email: **${userinfo.email}**
<:plec:813124159583289354>┃Płeć: **${userinfo.plec}**
🎁┃Data Urodzin: **${userinfo.data}**
<a:zainteresowania:813090210858270770>┃Zainteresowania: **${userinfo.zainteresowania || `-`}**
<a:wzrost:813090212242259998>┃Wzrost: **${userinfo.wzrost}**

**__Konto Discord:__**
<a:status:813090211343892550>┃Status: **${status || `Brak`}**
<a:niee:767605530897285141>┃Nick: **${nickname}**
<:tag:813090210828648469>┃Discord Tag: **${member.user.tag}**
<:pytanie:813090210245509171>┃Discord ID: **${member.user.id}**
📅┃Utworzenie Konta: **${moment(member.user.createdAt).format('L')} (${moment(member.user.createdAt, "YYYYMMDD").fromNow()})**

**__Główne Informacje:__**
<a:verify:813090212556832788>┃Reputacja: **${(levele.get(`level_${message.guild.id}_${member.id}`)).rep}**
<a:czokobonsy:810896578243461121>┃Stan Konta Ekonomi: **${db.get(`money_${message.guild.id}_${member.id}`) || 0}**
<:cos:813090210404630529>┃Level Tekstowy: **${levelObj.level}**
<:rakieta:813088303817555999>┃Level Głosowy: **${levelObj.levelVC}**

**__Informacje Server:__**
<a:verify_czarne:813090211823222814>┃Dołączył/a na serwer: **${moment(member.joinedAt).format(`L`)} (${moment(member.joinedAt, "YYYYMMDD").fromNow()})**
<:mail:813090210626666506>┃Ilość ról: **${member.roles.cache.size}**
<:tarcza:810896578458026024>┃Ilość warnów: **${ilosc}**
<:prawo:810899802778501140>┃Rola najwyższa: **${member.roles.highest}**
        `)
            .setColor(message.member.roles.highest.color)
            .setThumbnail(member.user.avatarURL({ dynamic: true }))
            .setFooter(`${message.author.username}`, message.author.avatarURL({ dynamic: true }))
            .setAuthor(`Czilerka`, client.user.avatarURL({ dynamic: true }))
            .setTimestamp()
        return message.channel.send(embed)
    }
}