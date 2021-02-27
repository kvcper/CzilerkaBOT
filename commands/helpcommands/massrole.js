const discord = require("discord.js")
const db = require("quick.db")
const latinize = require("latinize")

module.exports = {
    name: "massrole",
    usage: "mute <user> <time>",
    run: async (client, message, args) => {
        message.delete()
        if (!args[0]) {
            console.log(`atypowe `+ await message.guild.members.cache.filter(m => !m.user.bot).filter(m => !m.roles.cache.has("800504217638666251")).size)
            console.log(`tekstowe `+await message.guild.members.cache.filter(m => !m.user.bot).filter(m => !m.roles.cache.has("800504231840186398")).size)
            console.log(`0tekstowe `+await message.guild.members.cache.filter(m => !m.user.bot).filter(m => !m.roles.cache.has("800504249964036146")).size)
            console.log(`glosoew `+await message.guild.members.cache.filter(m => !m.user.bot).filter(m => !m.roles.cache.has("800504250928594974")).size)
            console.log(`0glosowe `+await message.guild.members.cache.filter(m => !m.user.bot).filter(m => !m.roles.cache.has("800504267386781707")).size)
            console.log(`czilerkowicz `+await message.guild.members.cache.filter(m => !m.user.bot).filter(m => !m.roles.cache.has("800504302879244319")).size)
            console.log(`wlasne `+await message.guild.members.cache.filter(m => !m.user.bot).filter(m => !m.roles.cache.has("800504304913612810")).size)
        }
        if (args[0]){
            if (message.guild.roles.cache.get(args[0])){
                let ilosc = await message.guild.members.cache.filter(m => !m.user.bot).filter(m => !m.roles.cache.has(args[0])).size
                let wykonane = 0
                message.guild.members.cache.filter(m => !m.user.bot).filter(m => !m.roles.cache.has(args[0])).forEach(async (member) => {
                    if (!member.roles.cache.has(args[0])){
                        await member.roles.add(args[0])
                        wykonane++
                        console.log(wykonane + ` / ` + ilosc)
                    }
                })
            }else{
                let msg = await message.channel.send(`Nie znaleziono podanej roli`)
            return msg.delete({ timeout: 5000 });
            }
        }
    }
}