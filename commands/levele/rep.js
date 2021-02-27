const db = require("quick.db")
const Discord = require("discord.js")
const fs = require('fs');
let levele = JSON.parse(fs.readFileSync("./Config/levele.json", "utf8"));

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + "h " + minutes + "m " + seconds + "s";
}

module.exports = {
    name: "rep",
    run: async (client, message, args) => {
        let color = message.guild.members.cache.get(client.user.id).roles.highest.color
        var levele = new db.table('levele')
        const embed = new Discord.MessageEmbed()
        let member = message.mentions.members.first() || message.guild.members.cache.find(x => x.id == args[0]);
        if (member) {
            if (member == message.member) {
                return message.channel.send(`Nie możesz dać sobie punktu reputacji!`)
            }
          let levelObjAuthor = levele.get(`level_${message.guild.id}_${message.author.id}`);
      if (!levelObjAuthor) {
        levelObjAuthor = {
      level: 0,
      TextXP: 0,
      ReqTextXP: levele[1],
      levelVC: 0,
      VCXP: 0,
      ReqVCXP: 100,
      rep: 0
    };
        levele.set(`level_${message.guild.id}_${message.author.id}`, levelObjAuthor);
        levelObjAuthor = levele.get(`level_${message.guild.id}_${message.author.id}`);
        levele.set(`GlobalTextXP_${message.guild.id}_${message.author.id}`, 0);
        levele.set(`GlobalVCXP_${message.guild.id}_${message.author.id}`, 0);
      }
          
          let levelObjMember = levele.get(`level_${message.guild.id}_${member.id}`);
      if (!levelObjMember) {
        levelObjMember = {
      level: 0,
      TextXP: 0,
      ReqTextXP: levele[1],
      levelVC: 0,
      VCXP: 0,
      ReqVCXP: 100,
      rep: 0
    };
        levele.set(`level_${message.guild.id}_${member.id}`, levelObjMember);
        levelObjMember = levele.get(`level_${message.guild.id}_${member.id}`);
        levele.set(`GlobalTextXP_${message.guild.id}_${member.id}`, 0);
        levele.set(`GlobalVCXP_${message.guild.id}_${member.id}`, 0);
      }
          
            if (levelObjAuthor.level >= 5) {
                let reptime = levelObjAuthor.reptime || 0
                if ((reptime - Date.now()) > 0) {
                    return message.channel.send(`Aby dać komuś punkt reputacji musisz odczekać jeszcze ${msToTime((reptime) - Date.now())}`)
                } else {
                    levelObjMember.rep+=1
                    levelObjAuthor.reptime = Date.now() + 10800000
                    message.channel.send(`Właśnie dałeś użytkownikowi ${member} 1 punkt reputacji! (Łącznie ${levelObjMember.rep})`)
                    levele.set(`level_${message.guild.id}_${message.author.id}`, levelObjAuthor);
                    levele.set(`level_${message.guild.id}_${member.id}`, levelObjMember);
                }
            } else {
                return message.channel.send(`Aby dać komuś punkt reputacji musisz mieć co najmniej 5 level!`)
            }
        } else {
            return message.channel.send(`Aby dać komuś punkt reputacji musisz oznaczyć tą osobę!`)
        }
    }
}