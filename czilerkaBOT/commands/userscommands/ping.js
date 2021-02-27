module.exports = {
    name: "ping",
    aliases: ["Ping", "PING", " ping", " Ping", " PING"],
    description: "Ping bota",
    run: async (client, message, args) => {
        message.channel.send('Obliczanie pingu bota').then((resultMessage) => {
            const ping = resultMessage.createdTimestamp - message.createdTimestamp 
            resultMessage.edit("Mój ping wynosi: `" + `${ping}ms` + "`")

        })
    }
}