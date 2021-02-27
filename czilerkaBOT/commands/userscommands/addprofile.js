const db = require("quick.db")
const discord = require("discord.js")
function isValidHttpUrl(string) {
    let url;
  
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
  
    return url.protocol === "http:" || url.protocol === "https:";
  }
function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);

}
module.exports ={
    name: "editprofile",
    triggers: [
		["editprofile"],
	],
    run: async (client, message, args) => {
        let user = message.author;
       if(!args[0]) return message.channel.send("Proszę wybrać dostępną opcję edycji profilu\n <nazwa | zdjęcie | opis>")
if(args[0].toLowerCase() === "nazwa") {
    let name = args.slice(1, 3).join(" ") 
    if(args[4]) return message.channel.send("Maksymalna długość nazwy to 3 słowa!")
    if(!name) return message.channel.send("Nie podano nazwy")
    db.set(`profile_${user.id}.name`, name)
    return message.channel.send("Ustawiono nową nazwę")
}
if(args[0].toLowerCase() === "zdjęcie") {
    let url = args[1]
    if(isValidHttpUrl(url) === false) return message.channel.send("Nie podano poprawnego linku")
    if(checkURL(url) === null) return message.channel.send("Podano zły link do zdjęcia")
    db.set(`profile_${user.id}.pic`, url)
    return message.channel.send("Ustawiono nowe zdjęcie profilu")
}
if(args[0].toLowerCase() === "opis") {
    let opis = args.slice(1, 200).join(" ")
    if(args[201]) return message.channel.send("Maksymalna ilość słów na opis to 200 słów!")
    db.set(`profile_${user.id}.description`, opis)
    return message.channel.send("Ustawiono nowy opis!")
} else return message.channel.send("Wybrano niedostępną opcję\n < nazwa | zdjęcie | opis >")
    }
}