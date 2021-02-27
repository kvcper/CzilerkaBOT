const Discord = require('discord.js')
const moment = require('moment-timezone')
const qdb = require(`quick.db`)
const config = require(`../../Config/config.json`)
const ceny = require(`../../Config/ceny.json`)

module.exports = {
	name: "sklep",
	triggers: [
		["sklep"],
	],
	description: "Shows info about you/provided user.",
	category: "users",
	args: true,
	usage: "(@user/user ID)",
	async run(client, message, args) {
		if (!args[0]) {
			let embed = new Discord.MessageEmbed()
				.setColor('#fffb00')
				.setAuthor(`Oficjalny Sklepik Czilerki`, client.user.avatarURL({dynamic:true}))
				.setDescription(`<:medal123:767605531111194634> Tutaj znajdziesz wszystkie itemy które posiadamy w naszym obecnym sklepiku serwerowym.
**\`Wszystkie itemy zakupujesz pod komendą "!kup".\`** 

**<a:czokobonsy:767191684458872843> ${ceny.cena.nick} - ZMIANA NICKU**
**Opis:** Pozwala jednorazowo zmieniać nazwe użytkownika na serwerze.
**\`-\`** Aby zakupić zmiane nicku, wpisz **\`!kup nick <twój nick>\`**

**<a:czokobonsy:767191684458872843> 9,000 - LOSOWY KOLOR**
**Opis:** Ustawia losowy kolor nicku na 30 dni
**\`-\`** Aby zakupić kolor, wpisz **\`!kup kolor losowy\`**

**<a:czokobonsy:767191684458872843> 10,000 - KOLOR**
**Opis:** Ustawia kolor nicku na 30 dni
Dostępne kolory: ${message.guild.roles.cache.find(r => r.name === 'Zielony')}  ${message.guild.roles.cache.find(r => r.name === 'Czerwony')} ${message.guild.roles.cache.find(r => r.name === 'Żółty')} ${message.guild.roles.cache.find(r => r.name === 'Różowy')} ${message.guild.roles.cache.find(r => r.name === 'Niebieski')} ${message.guild.roles.cache.find(r => r.name === 'Pomarańczowy')} ${message.guild.roles.cache.find(r => r.name === 'Fioletowy')} ${message.guild.roles.cache.find(r => r.name === 'Czarny')} ${message.guild.roles.cache.find(r => r.name === 'Aqua')}
**\`-\`** Aby zakupić kolor, wpisz **\`!kup kolor <nazwa koloru>\`**

**<a:czokobonsy:767191684458872843> 10,000  - FARMA KOKOSÓW**
**Opis:** Pozwala kupić farmę kokosów na 30 dni (500$ co 24h)
**\`-\`** Aby zakupić farme, wpisz **\`!kup farma\`**

**<a:czokobonsy:767191684458872843> 13,000 - EMOJI**
**Opis:** Kupując tą role będziesz w stanie używać emotek z innych serwerów!
**\`-\`** Aby zakupić role emoji, wpisz **\`!kup emoji\`**

**<a:czokobonsy:767191684458872843> 24,000 50K EXP**
**Opis:** Jednorazowo daje 50 tysięcy expa
**\`-\`** Aby zakupić 50k EXPA**,** wpisz **\`!kup 50k <tekstowy/voice>\`**

**<a:czokobonsy:767191684458872843> 26,000 - UNIKALNA ROLA**
**Opis:** Tworzy oraz daje unikanlą rolę
**\`-\`** Aby zakupić unikalną rolę, wpisz **\`!kup rola <nazwa roli>\`**

**<a:czokobonsy:767191684458872843> 39,000 - VIP**
**Opis:** Daje rangę VIP na 30 dni
**\`-\`** Aby zakupić VIPA, wpisz **\`!kup VIP\`** 

<:znak:772128359022460938> **Za znalezione błędy nagroda w postaci czokobonsów** <:znak:772128359022460938>
**\`1/2 strony czilerkowego sklepiku\`**
   `)
				.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
				//.addFields(...Object.values(shop).map((shopItem)=>({name: `${guildConfig.moneyEmoji} ${shopItem.price}: ${shopItem.name}`, value: `${shopItem.description}`})))
				.setTimestamp(message.createdAt)

			message.channel.send(embed);
		} if (args[0] == 2) {
			let embed = new Discord.MessageEmbed()
				.setColor('#fffb00')
				.setAuthor(`Oficjalny Sklepik 2 Czilerki`, client.user.avatarURL({dynamic:true}))
				.setDescription(`**\`Wszystkie itemy zakupujesz pod komendą "!kup".\`** 

**<a:czokobonsy:767191684458872843> 40,000 - UNWARN**
**Opis:** Pozwala jednorazowo usunąć warna nadanego przez administracje.
**\`-\`** Aby zakupić un warna, wpisz **\`!kup unwarn <id warna>\`**

**<a:czokobonsy:767191684458872843> 50,000 - PREMIUM VIP**
**Opis:** Daje rangę PREMIUM VIP na 30 dni
**\`-\`** Aby zakupić PREMIUM VIP, wpisz **\`!kup premium\`**
				
**<a:czokobonsy:767191684458872843> 80,000 - WŁASNY KANAŁ GŁOSOWY**
**Opis:** Wynajmując własny kanał głosowy masz możliwość pogadania z swoimi znajomymi gdzie ty ustalasz z kim gadasz i ty ustawiasz premisje kanału!
Cennik: 24h - 3,000
7 dni - 20,000
30 dni 80,000
**\`-\`** Aby zakupić role emoji, wpisz **\`!kup kanał (24h/3d/7d)\`**

**<a:czokobonsy:767191684458872843> 100,000 - KOCUR**
**Opis:** Kupując tą range odczujesz wielki flex oraz wyróżnienie na wszystkich czatach tekstowych oraz głosowych.
**\`-\`** Aby zakupić role kocur, wpisz **\`!kup kocur\`**
				
<:znak:772128359022460938> **Za znalezione błędy nagroda w postaci czokobonsów** <:znak:772128359022460938>				
**\`2/2 strony czilerkowego sklepiku\`**
				   `)
				.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
				//.addFields(...Object.values(shop).map((shopItem)=>({name: `${guildConfig.moneyEmoji} ${shopItem.price}: ${shopItem.name}`, value: `${shopItem.description}`})))
				.setTimestamp(message.createdAt)

			message.channel.send(embed);
		}
	}
};