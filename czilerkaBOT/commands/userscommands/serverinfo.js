const discord = require("discord.js")

module.exports = {
  name: "serverinfo",
  aliases: ["serverinfo", "sinfo"],
    run: async (bot, message, args) => {
        let owner = [];
        await bot.users.fetch(message.guild.ownerID).then(o => owner.push(o.tag))
        try {
            let embed = new discord.MessageEmbed()
                .setColor("GREEN")
                .setTitle("Server Info")
                .setThumbnail(message.guild.iconURL())
                .setAuthor(`${message.guild.name} Info`, message.guild.iconURL())
                .addField("**Nazwa Serwera:**", `${message.guild.name}`, true)
                .addField("**Właściciel**", `${owner}`, true)
                .addField("**ID Serwera**", `${message.guild.id}`)
                .addField("**Stworzono:**", `${message.guild.createdAt}`)
                .addField("**Tekstowe kanały:**", `${message.guild.channels.cache.filter(r => r.type === "text").size}`)
                .addField("**Głosowe kanały:**", `${message.guild.channels.cache.filter(c => c.type === "voice").size}`)
                .addField("**Osoby:**", `${message.guild.memberCount}`, true)
                .addField("**Role:**", `${message.guild.roles.cache.size}`, true)
            message.channel.send(embed);
            
        }
        catch (error) {
            console.log(error)
            return message.channel.send('Coś poszło nie tak!')
        }
    }
}