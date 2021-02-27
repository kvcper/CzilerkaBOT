const db = require("quick.db");
const Discord = require("discord.js");
const fs = require("fs");
const levele = JSON.parse(fs.readFileSync("./Config/levele.json", "utf8"));
const rangi = JSON.parse(fs.readFileSync("./Config/rangi.json", "utf8"));
const rangivc = JSON.parse(fs.readFileSync("./Config/rangivc.json", "utf8"));
const ownerID = ["530136949739094018", "323874922323640321"]

async function usuwanie(stararola, user, guild) {
  const mMember = user.member || guild.members.cache.get(user.id);
  let stararolacheck = guild.roles.cache.find(x => x.id == stararola.id);
  if (mMember.roles.cache.has(stararolacheck.id)) {
    await mMember.roles.remove(stararolacheck.id);
  }
}

module.exports = {
  name: "wyczysc",
  run: async (client, message, args) => {
    if (!ownerID.includes(message.author.id)) return message.channel.send("Przykro mi, nie możesz użyc tej komendy ponieważ właściciel ma tylko do niej dostęp!")
    var levels = new db.table('levele')
    if (args[0] == `chat` || args[0] == `text`|| args[0] == `tekstowy`) {
      let member;
      if (!args[1]) {
        return message.channel.send(`Musisz określić użytkownika!`);
      } else {
        member =
          message.mentions.members.first() ||
          message.guild.members.cache.find(x => x.id == args[1]);
      }
      if (!member) {
        return message.channel.send(`Nie znaleziono użytkownika`);
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
      levelObj.TextXP = 0;
      levels.set(`GlobalTextXP_${message.guild.id}_${member.id}`, 0);
      levelObj.ReqTextXP = levele[1];
      levelObj.level = 0;
      levels.set(`level_${message.guild.id}_${member.id}`, levelObj);

      await Object.entries(rangi).forEach(([key, value]) => {
        if (member.roles.cache.find(r => r.name === value)) {
          member.roles.remove(
            member.guild.roles.cache.find(x => x.name === value)
          );
        }
      });

      return message.channel.send(`udano`);
    }
    if (args[0] == `voice`) {
      let member;
      if (!args[1]) {
        return message.channel.send(`Musisz określić użytkownika!`);
      } else {
        member =
          message.mentions.members.first() ||
          message.guild.members.cache.find(x => x.id == args[1]);
      }
      if (!member) {
        return message.channel.send(`Nie znaleziono użytkownika`);
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
      levelObj.VCXP = 0;
      levels.set(`GlobalVCXP_${message.guild.id}_${member.id}`, 0);
      levelObj.ReqVCXP = levele[1];
      levelObj.levelVC = 0;
      levels.set(`level_${message.guild.id}_${member.id}`, levelObj);
      await Object.entries(rangivc).forEach(([key, value]) => {
        if (member.roles.cache.find(r => r.name === value)) {
          member.roles.remove(
            member.guild.roles.cache.find(x => x.name === value)
          );
        }
      });

      return message.channel.send(`udano`);
    } else return message.channel.send(`Określ typ exp'a (chat/voice)`);
  }
};
