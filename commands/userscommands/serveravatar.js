const Discord = require("discord.js")
module.exports = {
  name: "avatarserver",
  aliases: ["serveravatar", "avatarserwer"],
  run: async (client, message, args) => {
        const embed = new Discord.MessageEmbed()
      .setTitle(`Avatar serwera ${message.guild.name}`)
      .setImage(message.guild.iconURL({ dynamic: true, size: 512 }))
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
}
