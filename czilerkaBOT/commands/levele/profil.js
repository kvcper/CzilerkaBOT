const db = require("quick.db")
const Discord = require("discord.js")
const fs = require('fs');
const Canvas = require('canvas');
let levels = JSON.parse(fs.readFileSync("./Config/levele.json", "utf8"));

module.exports = {
  name: "profil",
  aliases: ["profile"],
  run: async (client, message, args) => {
    let member;
    if (!args[0]) {
      member = message.member
    } else {
      member = message.mentions.members.first() || message.guild.members.cache.find(x => x.id == args[0])
    }
    if (!member) {
      return message.channel.send(`Nie znaleziono użytkownika`)
    }
    Canvas.registerFont('./Czcionki/Roboto-Black.ttf', { family: 'fontFamily' });
    Canvas.registerFont('./Czcionki/Roboto-Thin.ttf', { family: 'fontFamily' });
    Canvas.registerFont('./Czcionki/Roboto-Regular.ttf', { family: 'fontFamily' });
    Canvas.registerFont('./Czcionki/Roboto-Light.ttf', { family: 'fontFamily' });
    Canvas.registerFont('./Czcionki/Roboto-Bold.ttf', { family: 'fontFamily' });
    Canvas.registerFont('./Czcionki/Roboto-Medium.ttf', { family: 'fontFamily' });
    Canvas.registerFont('./Czcionki/seguiemj.ttf', { family: 'fontFamily' });
    var levele = new db.table('levele')
    let levelObj = levele.get(`level_${message.guild.id}_${member.id}`);
    if (!levelObj) {
      levelObj = {
        level: 0,
        TextXP: 0,
        ReqTextXP: levels[1],
        levelVC: 0,
        VCXP: 0,
        ReqVCXP: levels[1],
        rep: 0
      };
      levele.set(`level_${message.guild.id}_${member.id}`, levelObj);
      levelObj = levele.get(`level_${message.guild.id}_${member.id}`);
      levele.set(`GlobalTextXP_${message.guild.id}_${member.id}`, 0);
      levele.set(`GlobalVCXP_${message.guild.id}_${member.id}`, 0);
    }

    const canvas = Canvas.createCanvas(1000, 1000);
    const ctx = canvas.getContext('2d');
    const background = await Canvas.loadImage('./Grafiki/kartaprofile.png');

    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png', size: 4096 }));
    ctx.drawImage(avatar, 352, 237, 310, 310);

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    if (levelObj.level != 150) {
      ctx.font = '600 35px Roboto';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = `center`
      ctx.fillText(`${levelObj.TextXP}/${levelObj.ReqTextXP}`, 500, 900);
    } else {
      ctx.font = '900 35px Roboto';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = `center`
      ctx.fillText(`${levelObj.TextXP}`, 500, 900);
    }

    ctx.font = '600 35px Roboto';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = `center`
    ctx.fillText(`TOTAL XP: ${(levelObj.TextXP += levelObj.VCXP)}`, 500, 850);

    let bazatextxp = levele
      .all()
      .filter(i => i.ID.startsWith(`GlobalTextXP_${message.guild.id}`))
      .sort((a, b) => b.data - a.data);
    let rankc =
      bazatextxp
        .map(x => x.ID)
        .indexOf(`GlobalTextXP_${message.guild.id}_${member.id}`) + 1;

    ctx.font = '900 50px Roboto';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = `center`
    ctx.fillText(`${rankc}`, 175, 610);

    let bazavcxp = levele
      .all()
      .filter(i => i.ID.startsWith(`GlobalVCXP_${message.guild.id}`))
      .sort((a, b) => b.data - a.data);
    let rankv =
      bazavcxp
        .map(x => x.ID)
        .indexOf(`GlobalVCXP_${message.guild.id}_${member.id}`) + 1;

    ctx.font = '900 50px Roboto';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = `center`
    ctx.fillText(`${rankv}`, 835, 610);

    ctx.font = '900 90px Roboto';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = `center`
    ctx.fillText(`${levelObj.level}`, 810, 270);

    ctx.font = '900 90px Roboto';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = `center`
    ctx.fillText(`+${levelObj.rep}`, 175, 270);

    var font = 80
    ctx.font = `900 ${font}px Segoe UI Emoji`;
    let nickname;
    if (member.nickname) {
      nickname = member.nickname
    } else {
      nickname = member.user.username
    }
    var dlugosc = nickname;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = `center`;
    while (ctx.measureText(`${dlugosc}`).width > 350) {
      font = font -= 1;
      ctx.font = `900 ${font}px Segoe UI Emoji`;
    }
    ctx.fillText(`${dlugosc}`, 500, 640);

    //ctx.beginPath();
    //ctx.arc(137.5, 112.5, 130, 0, Math.PI * 2, true);
    //ctx.closePath();
    //ctx.clip();

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'karta.png');
    return message.channel.send(attachment);
  }
};