const db = require("quick.db");
const Discord = require("discord.js");
const moment = require("moment-timezone")

module.exports = {
    name: "wakacje",
    run: async (client, message, args) => {
        moment.locale(`pl`)
        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setAuthor('Czilerka', client.user.avatarURL())
            .setTitle(`Wakacje`)
            .setDescription(`Do wakacji zostało ${moment([2021, 06, 25]).diff(moment(Date.now()), 'days')}`)
        return message.channel.send(embed);
    }
}