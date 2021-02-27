const discord = require("discord.js")

module.exports = {
    name: "sugestia",
    run: async (client, message, args) => {
        let msg = await message.channel.send(`Napisz tytuł propozycji!`)
        let responses = await message.channel.awaitMessages(
            msg => msg.author.id === message.author.id,
            { time: 300000, max: 1 }
        );
        let answer1 = responses.first().content

        msg.edit(`A teraz napisz treść propozycji!`)

        responses = await message.channel.awaitMessages(
            msg => msg.author.id === message.author.id,
            { time: 300000, max: 1 }
        );
        let answer2 = responses.first().content
        message.channel.send(`wyslano propozycje`)

        let sChannel = message.guild.channels.cache.find(x => x.id === "782666598556631113")
        if (!sChannel) return message.channel.send("Nie znaleziono takiego kanału")

        let embed = new discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
            .setTitle(answer1)
            .setTimestamp(Date.now())
            .setDescription(answer2)
        sChannel.send(embed).then(async (msg) => {
            await msg.react("✅")
            await msg.react("➖")
            await msg.react("❎")
        })
    }
}