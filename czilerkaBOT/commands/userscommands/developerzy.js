const discord = require("discord.js")

module.exports = {
    name: "developerzy",
    aliases: "developerzy" ,
    run: async (client, message, args) => {
        let color = ("#ff0000")
        let embed = new discord.MessageEmbed()
            .setAuthor('Czilerka', client.user.avatarURL())
            .setTitle ('Zespół bota CZILERKA są:')
            .setDescription(`
**Twórca Bota:**           
<:verify:806664524874383371> **┃** <@530136949739094018>     
└ [discord.bio/p/kvcper](https://discord.bio/p/kvcper)

**Support Bota:**
<:staff:806664448273809448> **┃** <@652246942591746058>
└ [discord.bio/p/kuero](https://discord.bio/p/kuero)
`)
            .setColor(color)
        message.channel.send(embed)
    }
}