const db = require("quick.db")
const Discord = require("discord.js")
const fs = require('fs');
var latinize = require('latinize');

Number.isInteger = Number.isInteger || function (value) {
    return typeof value === 'number' &&
        isFinite(value) &&
        Math.floor(value) === value;
};

function toLower(text) {
    return text.toLowerCase();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
    name: "rekrutacja",
    run: async (client, message, args) => {
        if (!args[0]){
            let embed = new Discord.MessageEmbed()
                .setAuthor('Czilerka', client.user.avatarURL())
                .setTitle(`Informacje o rekrutacji`)
                .setColor("YELLOW")
                .setDescription(`<:znak:772128359022460938>**┃**Aktualnie rekrutacja na próbnego Pomocnika jest **${db.get(`rekrutacja_${message.guild.id}`)}**!`)
            return message.channel.send(embed)
        }
        if (args[0] == `info`) {
            let embed = new Discord.MessageEmbed()
                .setAuthor('Czilerka', client.user.avatarURL())
                .setTitle(`Informacje o rekrutacji`)
                .setColor("YELLOW")
                .setDescription(`<:znak:772128359022460938>**┃**Aktualnie rekrutacja na próbnego Pomocnika jest **${db.get(`rekrutacja_${message.guild.id}`)}**!`)
            return message.channel.send(embed)
        } if (latinize(args[0]).toLowerCase() == `wlacz`){
            if(!message.member.hasPermission(`ADMINISTRATOR`)) return message.channel.send(`Nie masz uprawnień!`)
            db.set(`rekrutacja_${message.guild.id}`, `Włączona`)
            let embed = new Discord.MessageEmbed()
                .setAuthor('Czilerka', client.user.avatarURL())
                .setTitle(`Rekrutacja`)
                .setColor("YELLOW")
                .setDescription(`Ustawiono rekrutację na **${db.get(`rekrutacja_${message.guild.id}`)}**!`)
            return message.channel.send(embed)
        }if (latinize(args[0]).toLowerCase() == `wylacz`){
            if(!message.member.hasPermission(`ADMINISTRATOR`)) return message.channel.send(`Nie masz uprawnień!`)
            db.set(`rekrutacja_${message.guild.id}`, `Wyłączona`)
            let embed = new Discord.MessageEmbed()
                .setAuthor('Czilerka', client.user.avatarURL())
                .setTitle(`Rekrutacja`)
                .setColor("YELLOW")
                .setDescription(`Ustawiono rekrutację na **${db.get(`rekrutacja_${message.guild.id}`)}**!`)
           return  message.channel.send(embed)
        }else message.channel.send(`Poprawne komendy to są \`!rekrutacja info/włącz/wyłącz\``)
    }
}