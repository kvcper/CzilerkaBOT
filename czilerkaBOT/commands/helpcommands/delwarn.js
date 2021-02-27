const db = require("quick.db")

module.exports = {
    name: "delwarn",
    triggers: [
		["delwarn"],
	],
    run: async (client, message, args) => {
        let warns = db.get(`warnings_${message.guild.id}`)
        if(!message.member.hasPermission(8)) return message.channel.send("Nie masz do tego uprawnień")
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(member){
            let id = parseInt(args[1])
            if(args[1] ===  'all'){
                for(let i = 0; i < warns.length; i++){
                    if(warns[i] == null)continue
                    if(warns[i].user != null && warns[i].user == member.user.id){
                        warns.splice(i,1)
                    }
                }
                db.set(`warnings_${message.guild.id}`, warns)
                return message.channel.send(`Usunięto wszystkie ostrzeżenia użytkownika ${member.user.tag}`)
            }
            if(!args[1])return message.channel.send("Nie podano ID warna")
            if(isNaN(id)) return message.channel.send("ID nie jest liczbą")
            const index = warns.findIndex(el => el.id === id)
            warns.splice(index, 1)
            db.set(`warnings_${message.guild.id}`, warns)
            return message.channel.send("Usunięto warna o ID " + id)
        }
        let id = parseInt(args[0])
        if(!args[0]) return message.channel.send("Nie podano ID warna")
        if(isNaN(id)) return message.channel.send("ID nie jest liczbą")
        if(warns === null || warns.length < 1) return message.channel.send("Nie ma żadnych warnów na tym serwerze")
        let warnFind = warns.filter(w => w != null)
        let finalWarn = warnFind.find(w => w.id === id)
        if(!finalWarn)return message.channel.send(`Nie znaleziono warna o takim ID`)
        const index = warnFind.findIndex(w => w.id == id)
        warns.splice(index, 1)
        db.set(`warnings_${message.guild.id}`, warns)
        return message.channel.send("Usunięto warna o ID " + id)
     }
}