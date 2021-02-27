const Discord = require("discord.js");
const fs = require('fs');
const Canvas = require('canvas');

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    name: "ship",
    triggers: [
		["ship"],
	],
    aliases: [],
    run: async (client, message, args) => {
        //if (message.channel.id != `723862235746926652`) return
        function getUser(mention) {
            if (!mention) return;

            if (mention.startsWith(`<@`) && mention.endsWith(`>`)) {
                mention = mention.slice(2, -1);

                if (mention.startsWith(`!`)) {
                    mention = mention.slice(1);
                }

                return client.users.cache.get(mention);
            } else return client.users.cache.get(mention);
        }
        async function ship(user1, user2) {
            const elo = getRandomIntInclusive(0, 100);
            const canvas = Canvas.createCanvas(1920, 1080);
            const ctx = canvas.getContext('2d');
            const background = await Canvas.loadImage('./Grafiki/ship.png');

            const avatar1 = await Canvas.loadImage(user1.displayAvatarURL({ format: 'png', size: 1024, dynamic: true }));
            ctx.drawImage(avatar1, 50, 200, 680, 680);

            const avatar2 = await Canvas.loadImage(user2.displayAvatarURL({ format: 'png', size: 2048, dynamic: true }));
            ctx.drawImage(avatar2, 1190, 200, 680, 680);

            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

            ctx.font = '900 100px Roboto';
            ctx.shadowBlur = 3;
            ctx.shadowColor = '#000000';
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = "center";
            ctx.fillText(`${elo}%`, 970, 920);

            fs.writeFileSync('out.png', canvas.toBuffer())
            const attachment = new Discord
                .MessageAttachment('out.png', 'sample.png');
            message.channel.send(attachment);
        }
        let user = getUser(args[0]);
        let user2 = getUser(args[1]);
        if (!user2 && user) {
            return ship(message.author, user)
        } if (user2 && user) {
            ship(user, user2)
        } if (!user2 && !user) {
            const nie = new Discord.MessageEmbed()
                .setDescription('**Niepoprawne użycie!** Wpisz `.ship (użytkownik1) (użytkownik2)`')
                .setColor("#FF0000")
                .setTimestamp()
                .setFooter(`Na polecenie ` + message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
            return message.channel.send(nie);
        }
    }
}