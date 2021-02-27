const discord = require("discord.js")

module.exports = {
    name: "slowmode",
    description: "Lets you set slowmode on the channel.",
    args: true,
    usage: "<time>",
    run: async (client, message, args) => {
        const amount = parseInt(args[0])
        if (message.member.hasPermission("MANAGE_CHANNEL"))
            if (isNaN(amount)) return message.channel.send("Musisz podać czas! xs/xmin/xh")
        const embed = new discord.MessageEmbed()
            .setColor('#42ff6b')
            .setTitle(`Slowmode`)
        if (args[0] === amount + "s") {
            message.channel.setRateLimitPerUser(amount)
            if (amount > 1) {
                embed.setDescription("Ustawiłeś slowmode na " + amount + " sekund")
            }
            else {
                embed.setDescription("Ustawiłeś slowmode na " + amount + " sekundę")
            }
            message.delete()
            let msg = await message.channel.send(embed)
            msg.delete({ timeout: 5000 });
            return;
        } if (args[0] === amount + "min") {
            message.channel.setRateLimitPerUser(amount * 60)
            if (amount > 1) {
                embed.setDescription("Ustawiłeś slowmode na " + amount + " minut")
            } else {
                embed.setDescription("Ustawiłeś slowmode na " + amount + " minutę")
            }
            message.delete()
            let msg = await message.channel.send(embed)
            msg.delete({ timeout: 5000 });
            return;
        } if (args[0] === amount + "h") {
            message.channel.setRateLimitPerUser(amount * 60 * 60)
            if (amount > 1) {
                embed.setDescription("Ustawiłeś slowmode na " + amount + " godzin")
            } else {
                embed.setDescription("Ustawiłeś slowmode na " + amount + " godzinę")
            }
            message.delete()
            let msg = await message.channel.send(embed)
            msg.delete({ timeout: 5000 });
            return;
        } else {
            return message.channel.send("Możesz ustawić slowmode tylko na sekundy, minuty i godziny!")
        }
    }
}