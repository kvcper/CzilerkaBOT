const db = require("quick.db");
const Discord = require("discord.js");
const levele = new db.table('levele')

module.exports = {
  name: "top",
  run: async (client, message, args, guildConfig) => {
    if (!args[0]){
      return message.channel.send(`Wpisz \`Top exp/ekonomia\``)
    }
    if (args[0] == `exp`) {
      let color = message.guild.members.cache.get(client.user.id).roles.highest
        .color;
      const embed = new Discord.MessageEmbed();
      let xp = levele
        .all()
        .filter(data => data.ID.startsWith(`GlobalTextXP_${message.guild.id}`))
        .sort((a, b) => b.data - a.data);
      xp.length = 10;
      var finalLb = "";
      var i = 0;
      let indexnum = 0;
      for (i in xp) {
        finalLb += `#${++indexnum} | <@${xp[i].ID.split("_")[2]}> XP: \`${xp[i].data
          }\`\n`;
      }
      let vcxp = levele
        .all()
        .filter(data => data.ID.startsWith(`GlobalVCXP_${message.guild.id}`))
        .sort((a, b) => b.data - a.data);
      vcxp.length = 10;
      var finalLb2 = "";
      var i2 = 0;
      let indexnum2 = 0;
      for (i2 in vcxp) {
        finalLb2 += `#${++indexnum2} | <@${vcxp[i2].ID.split("_")[2]}> XP: \`${vcxp[i2].data
          }\`\n`;
      }
      embed.setAuthor("Top 10 aktywność na chatach", client.user.avatarURL());
      embed.setDescription(`Oficjalna wersja beta Czilerka`);
      embed.addField(`✍️ Top 10 Kanały tekstowe`, finalLb, true);
      embed.addField(`🎙️ Top 10 Kanały głosowe`, finalLb2, true);
      embed.setFooter(
        message.author.tag,
        message.author.displayAvatarURL({ format: "png", dynamic: true })
      );
      embed.setTimestamp();
      embed.setColor(color);
      message.channel.send(embed);
    } if (args[0] == `ekonomia`) {
      let xp = db.all().filter(data => data.ID.startsWith(`kasa_${message.guild.id}`)).sort((a, b) => b.data - a.data)
      xp.length = 10;
      var finalLb = "";
      var i = 0;
      let indexnum = 0;
      for (i in xp) {
        finalLb += `#${++indexnum} | <@${(xp[i].ID.split('_')[2])}> <a:czokobonsy:810896578243461121> \`${xp[i].data}\`\n`;
      }

      let embed = new Discord.MessageEmbed()
      .setAuthor('Czilerka', client.user.avatarURL({ dynamic: true }))
      embed.addField(`Top 10 Najbogatszych użytkowników`, finalLb, true)
      embed.setTimestamp(message.createdAt);
      embed.setColor('#fffb00')
      embed.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))

      message.channel.send(embed);
    }
  }
};
