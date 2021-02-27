const db = require("quick.db");
const fs = require("fs");
const Discord = require("discord.js");
let levele = JSON.parse(fs.readFileSync("./Config/levele.json", "utf8"));
const Canvas = require("canvas");
const latinize = require(`latinize`)

const levels = new db.table('levele')

module.exports = {
  name: "level",
  run: async (client, message, args) => {
    let color = message.guild.members.cache.get(client.user.id).roles.highest
      .color;
    if (
      args[0] == `vc` ||
      args[0] == `głosowe` ||
      args[0] == `głosowy` ||
      args[0] == `voice` ||
      args[0] == `v`
    ) {
      let member;
      if (!args[1]) {
        member = message.member;
      } else {
        member =
          message.mentions.members.first() ||
          message.guild.members.cache.find(x => x.id == args[1]);
      }
      let levelObj = levels.get(`level_${message.guild.id}_${member.id}`);
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
        levels.set(`level_${message.guild.id}_${member.id}`, levelObj);
        levelObj = levels.get(`level_${message.guild.id}_${member.id}`);
        levels.set(`GlobalTextXP_${message.guild.id}_${member.id}`, 0);
        levels.set(`GlobalVCXP_${message.guild.id}_${member.id}`, 0);
      }

      const canvas = Canvas.createCanvas(900, 220);
      const ctx = canvas.getContext("2d");
      const background = await Canvas.loadImage("./Grafiki/voice.png");

      ctx.rect(0, 0, 900, 220);
      ctx.fillStyle = "#18191c";
      ctx.fill();

      if (levelObj.VCXP > 0) {
        if (levelObj.levelVC != 150) {
          let difference = (levelObj.VCXP / levelObj.ReqVCXP) * 619;
          ctx.fillStyle = "#fceaa8";
          ctx.fillRect(11, 198, difference, 12);
        } else {
          ctx.fillStyle = "#fceaa8";
          ctx.fillRect(11, 198, 619, 12);
        }
      }

      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      ctx.beginPath();

      ctx.font = "900 26px Roboto";
      ctx.fillStyle = "#777777";
      ctx.textAlign = `center`;
      ctx.fillText(`Level`, 765, 42);

      ctx.font = "900 26px Roboto";
      ctx.fillStyle = "#777777";
      ctx.textAlign = `center`;
      ctx.fillText(`Exp`, 765, 146);

      if (levelObj.levelVC != 150) {
        ctx.font = "900 30px Roboto";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = `right`;
        ctx.fillText(`${levelObj.VCXP}`, 753, 185);

        ctx.font = "900 24px Roboto";
        ctx.fillStyle = "#565658";
        ctx.textAlign = `left`;
        ctx.fillText(`/ ${levelObj.ReqVCXP}`, 760, 185);
      } else {
        ctx.font = "900 30px Roboto";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = `center`;
        ctx.fillText(`${levelObj.VCXP}`, 760, 185);
      }

      ctx.font = "900 24px Roboto";
      ctx.fillStyle = "#777777";
      ctx.textAlign = `center`;
      ctx.fillText(`Chat`, 290, 120);

      ctx.font = "900 24px Roboto";
      ctx.fillStyle = "#777777";
      ctx.textAlign = `center`;
      ctx.fillText(`Rank`, 290, 140);

      ctx.font = "900 24px Roboto";
      ctx.fillStyle = "#777777";
      ctx.textAlign = `center`;
      ctx.fillText(`Voice`, 400, 120);

      ctx.font = "900 24px Roboto";
      ctx.fillStyle = "#777777";
      ctx.textAlign = `center`;
      ctx.fillText(`Rank`, 400, 140);

      let bazatextxp = levels
        .all()
        .filter(i => i.ID.startsWith(`GlobalTextXP_${message.guild.id}`))
        .sort((a, b) => b.data - a.data);
      let rankc =
        bazatextxp
          .map(x => x.ID)
          .indexOf(`GlobalTextXP_${message.guild.id}_${member.id}`) + 1;

      ctx.font = "900 40px Roboto";
      ctx.fillStyle = "#fceaa8";
      ctx.textAlign = `center`;
      ctx.fillText(`#${rankc}`, 290, 180);

      let bazavcxp = levels
        .all()
        .filter(i => i.ID.startsWith(`GlobalVCXP_${message.guild.id}`))
        .sort((a, b) => b.data - a.data);
      let rankv =
        bazavcxp
          .map(x => x.ID)
          .indexOf(`GlobalVCXP_${message.guild.id}_${member.id}`) + 1;

      ctx.font = "900 40px Roboto";
      ctx.fillStyle = "#fceaa8";
      ctx.textAlign = `center`;
      ctx.fillText(`#${rankv}`, 400, 180);

      ctx.font = "900 30px Roboto";
      ctx.fillStyle = "#fceaa8";
      ctx.textAlign = `center`;
      ctx.fillText(`${levelObj.levelVC}`, 765, 80);

      var font = 40;
      ctx.font = `900 ${font}px Roboto`;
      let nickname;
      if (member.nickname) {
        nickname = latinize(member.nickname);
      } else {
        nickname = latinize(member.user.username);
      }
      var dlugosc = nickname;
      ctx.fillStyle = "#fceaa8";
      ctx.textAlign = `left`;
      while (ctx.measureText(`${dlugosc}`).width > 270) {
        ctx.font = font -= 1;
        ctx.font = `900 ${font}px Roboto`;
      }
      ctx.fillText(`${dlugosc}`, 250, 80);
      ctx.fillStyle = "#575546";
      ctx.font = `900 ${font}px Roboto`;
      let tocos = ctx.measureText(`${dlugosc}`).width + 250;
      ctx.font = "500 40px Roboto";
      ctx.fillText(`#${member.user.discriminator}`, tocos, 80);
      ctx.stroke;

      ctx.beginPath();
      ctx.arc(137.5, 112.5, 62.5, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();

      const avatar = await Canvas.loadImage(
        member.user.displayAvatarURL({
          format: "png",
          size: 4096,
          dynamic: true
        })
      );
      ctx.drawImage(avatar, 75, 50, 125, 125);

      const attachment = new Discord.MessageAttachment(
        canvas.toBuffer(),
        "karta.png"
      );
      return message.channel.send(attachment);
    }
    if (
      args[0] == `txt` ||
      args[0] == `tekstowe` ||
      args[0] == `tekstowy` ||
      args[0] == `pisemne` ||
      args[0] == `pisemny` ||
      args[0] == `textowy` ||
      args[0] == `t`
    ) {
      let member;
      if (!args[1]) {
        member = message.member;
      } else {
        member =
          message.mentions.members.first() ||
          message.guild.members.cache.find(x => x.id == args[1]);
      }
      Canvas.registerFont("./Czcionki/Roboto-Black.ttf", { family: "fontFamily" });
      Canvas.registerFont("./Czcionki/Roboto-Thin.ttf", { family: "fontFamily" });
      Canvas.registerFont("./Czcionki/Roboto-Regular.ttf", { family: "fontFamily" });
      Canvas.registerFont("./Czcionki/Roboto-Light.ttf", { family: "fontFamily" });
      Canvas.registerFont("./Czcionki/Roboto-Bold.ttf", { family: "fontFamily" });
      Canvas.registerFont("./Czcionki/Roboto-Medium.ttf", { family: "fontFamily" });
      Canvas.registerFont("./Czcionki/seguiemj.ttf", { family: "fontFamily" });

      let levelObj = levels.get(`level_${message.guild.id}_${member.id}`);
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
        levels.set(`level_${message.guild.id}_${member.id}`, levelObj);
        levelObj = levels.get(`level_${message.guild.id}_${member.id}`);
        levels.set(`GlobalTextXP_${message.guild.id}_${member.id}`, 0);
        levels.set(`GlobalVCXP_${message.guild.id}_${member.id}`, 0);
      }

      const canvas = Canvas.createCanvas(900, 220);
      const ctx = canvas.getContext("2d");
      const background = await Canvas.loadImage("./Grafiki/tekstowe.png");

      ctx.rect(0, 0, 900, 220);
      ctx.fillStyle = "#18191c";
      ctx.fill();

      if (levelObj.TextXP > 0) {
        if(levelObj.level != 150){
          let difference = (levelObj.TextXP / levelObj.ReqTextXP) * 619;
          ctx.fillStyle = "#fceaa8";
          ctx.fillRect(11, 198, difference, 12);
        }else{
          ctx.fillStyle = "#fceaa8";
          ctx.fillRect(11, 198, 619, 12);
        }
      }

      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      ctx.beginPath();

      ctx.font = "900 26px Roboto";
      ctx.fillStyle = "#777777";
      ctx.textAlign = `center`;
      ctx.fillText(`Level`, 765, 42);

      ctx.font = "900 26px Roboto";
      ctx.fillStyle = "#777777";
      ctx.textAlign = `center`;
      ctx.fillText(`Exp`, 765, 146);

      if (levelObj.level != 150) {
        ctx.font = "900 30px Roboto";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = `right`;
        ctx.fillText(`${levelObj.TextXP}`, 753, 185);

        ctx.font = "900 24px Roboto";
        ctx.fillStyle = "#565658";
        ctx.textAlign = `left`;
        ctx.fillText(`/ ${levelObj.ReqTextXP}`, 760, 185);
      } else {
        ctx.font = "900 30px Roboto";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = `center`;
        ctx.fillText(`${levelObj.TextXP}`, 760, 185);
      }

      ctx.font = "900 24px Roboto";
      ctx.fillStyle = "#777777";
      ctx.textAlign = `center`;
      ctx.fillText(`Chat`, 290, 120);

      ctx.font = "900 24px Roboto";
      ctx.fillStyle = "#777777";
      ctx.textAlign = `center`;
      ctx.fillText(`Rank`, 290, 140);

      ctx.font = "900 24px Roboto";
      ctx.fillStyle = "#777777";
      ctx.textAlign = `center`;
      ctx.fillText(`Voice`, 400, 120);

      ctx.font = "900 24px Roboto";
      ctx.fillStyle = "#777777";
      ctx.textAlign = `center`;
      ctx.fillText(`Rank`, 400, 140);

      let bazatextxp = levels
        .all()
        .filter(i => i.ID.startsWith(`GlobalTextXP_${message.guild.id}`))
        .sort((a, b) => b.data - a.data);
      let rankc =
        bazatextxp
          .map(x => x.ID)
          .indexOf(`GlobalTextXP_${message.guild.id}_${member.id}`) + 1;

      ctx.font = "900 40px Roboto";
      ctx.fillStyle = "#fceaa8";
      ctx.textAlign = `center`;
      ctx.fillText(`#${rankc}`, 290, 180);

      let bazavcxp = levels
        .all()
        .filter(i => i.ID.startsWith(`GlobalVCXP_${message.guild.id}`))
        .sort((a, b) => b.data - a.data);
      let rankv =
        bazavcxp
          .map(x => x.ID)
          .indexOf(`GlobalVCXP_${message.guild.id}_${member.id}`) + 1;

      ctx.font = "900 40px Roboto";
      ctx.fillStyle = "#fceaa8";
      ctx.textAlign = `center`;
      ctx.fillText(`#${rankv}`, 400, 180);

      ctx.font = "900 30px Roboto";
      ctx.fillStyle = "#fceaa8";
      ctx.textAlign = `center`;
      ctx.fillText(`${levelObj.level}`, 765, 80);

      var font = 40;
      ctx.font = `900 ${font}px Roboto`;
      let nickname;
      if (member.nickname) {
        nickname = latinize(member.nickname);
      } else {
        nickname = latinize(member.user.username);
      }
      var dlugosc = nickname;
      ctx.fillStyle = "#fceaa8";
      ctx.textAlign = `left`;
      while (ctx.measureText(`${dlugosc}`).width > 270) {
        ctx.font = font -= 1;
        ctx.font = `900 ${font}px Roboto`;
      }
      ctx.fillText(`${dlugosc}`, 250, 80);
      ctx.fillStyle = "#575546";
      ctx.font = `900 ${font}px Roboto`;
      let tocos = ctx.measureText(`${dlugosc}`).width + 250;
      ctx.font = "500 40px Roboto";
      ctx.fillText(`#${member.user.discriminator}`, tocos, 80);
      ctx.stroke;

      ctx.beginPath();
      ctx.arc(137.5, 112.5, 62.5, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();

      const avatar = await Canvas.loadImage(
        member.user.displayAvatarURL({
          format: "png",
          size: 4096,
          dynamic: true
        })
      );
      ctx.drawImage(avatar, 75, 50, 125, 125);

      const attachment = new Discord.MessageAttachment(
        canvas.toBuffer(),
        "karta.png"
      );
      return message.channel.send(attachment);
    } else {
      const embed = new Discord.MessageEmbed()
        .setAuthor("Czilerka", client.user.avatarURL())
        .setTimestamp()
        .setColor(color)
        .setFooter(
          message.author.tag,
          message.author.displayAvatarURL({ format: "png", dynamic: true })
        )
        .setDescription(
          `<a:czilerka2:767384658991251478> **|**Podaj typ! (Voice/Tekstowe)`
        );
      return message.channel.send(embed);
    }
  }
};
