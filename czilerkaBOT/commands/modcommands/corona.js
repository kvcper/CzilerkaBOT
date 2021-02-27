const discord = require("discord.js")
const api = require("novelcovid");

module.exports = {
  name: "corona",
  category: "info",
  description: ":emoji_117~1: **GET THE STATUS OF COUNTRY COVID** :emoji_117~1:",
  usage: "corona all or corona <country>",
  aliases: ["covid", "covid19"],
  run: async (client, message, args) => {
    
    api.settings({
        baseUrl: 'https://disease.sh'
    })
    if(!args.length) {
      return message.channel.send("Nie podano nazwy kraju!")
    }
    
    if(args.join(" ") === "all") {
      let corona = await api.all()
      console.log(corona)
      let embed = new discord.MessageEmbed()
      .setTitle("Globalne zakażenia")
      .setColor("#ff2050")
      .addField("Wszystkie zakażenia", corona.cases, true)
      .addField("Wszystkie śmierci", corona.deaths, true)
      .addField("Wszystkie wyleczenia", corona.recovered, true)
      .addField("Dzisiejsze zakażenia", corona.todayCases, true)
      .addField("Dzisiejsze zakażenia", corona.todayDeaths, true)
      .addField("Aktywne zakażenia", corona.active, true);
      
      return message.channel.send(embed)
      
    }else{
      let corona = await api.countries({country: args.join(" ")}) //change it to countries
      if(corona == null || corona.cases == undefined) return message.channel.send("Nie znaleziono podanego kraju!")
      let embed = new discord.MessageEmbed()
      .setTitle(`${corona.country}`)
      .setColor("#ff2050")
      .addField("Wszystkie zakażenia",corona.cases, true)
      .addField("Wszystkie śmierci", corona.deaths, true)
      .addField("Wszystkie wyleczeniac", corona.recovered, true)
      .addField("Dzisiejsze zakażeniac", corona.todayCases, true)
      .addField("Dzisiejsze zakażeniac", corona.todayDeaths, true)
      .addField("Aktywne zakażenia", corona.active, true);
      
      return message.channel.send(embed)
      
    }
    
  }
}