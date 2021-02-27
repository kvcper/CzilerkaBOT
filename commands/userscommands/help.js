const discord = require("discord.js")

module.exports = {
    name: "help",
    aliases: ["info", "pomoc"],
    run: async (client, message, args) => {
        let color = message.guild.members.cache.get(client.user.id).roles.highest.color
        let embed = new discord.MessageEmbed()
            .setAuthor('Wszystkie Komendy Bota Czilerka', client.user.avatarURL())
            .setDescription(`Main serwer: [discord.gg/czilerka](https://discord.gg/czilerka)
        
<a:niee:767605530897285141>  ┃** Administratorskie ** (\`12\`)
ban, warn, kick, mute, unmute, clear, vmute, vunmute, vkick, delwarn, dm, say, add exp, delete exp, del money, reset economy, add money, rekrutacja włącz, rekrutacja wyłącz, slowmode

<:ochrona:767605531333885982> ┃**Bot** (\`7\`)
botinfo, bug, report, ping, propozycja, rekrutacja info, donate, developerzy

<:superka:773589060086136832> ┃**Reaction Roles** (auto role/weryfikacja)
weryfikacja stwórz, rr stwórz, rr usuń

<a:muzykaa:776996027453931561> ┃**Muzyczne** (\`8\`) (\`PREMIUM\`) 
play, stop, skip, pause, spotifile, np, queue, resume

<a:czokobonsy:770559769706233876> ┃**Ekonomia** (\`15\`)
bal, sklep, kup, przelej, status vip, kanał info, dzienne, wpłać, zarabianie, przelej, sklep, wypłać

<:technologia:771039369116385280> ┃**Dla wszystkich:** (\`8\`)
ship, avatar, user, serveravatar, covid, level tekstowy, top, level głosowy,stats me, profil, rep, top economy, kanał info, warnings, menu slubu, rozwod, slub, stats top, stats user, stats server, invite me, invite shop, top invite, wakacje

<a:profil:788522366619090986>┃**Profile** (\`7\`)
dodaj user wiek, dodaj user województwo, dodaj user email, dodaj user zainteresowania, dodaj user data urodzin, dodaj user płeć, dodaj user wzrost, dodaj user imie

<:czilerka:776995901612097537>┃**Informacje o Czilerce:** (\`2\`)
<:czilerka_avatar:786207400918777857> [discord.gg/czilerka](https://discord.gg/czilerka)
<:prawo:810899802778501140>┃[http://czilerka.com/](http://czilerka.com/) (nie aktywna)


`)

            .setColor(color)
            .setThumbnail(message.guild.iconURL({ format: 'png' }))       
        message.channel.send(embed)
    }
}