module.exports = {
    name: "say",
    ownerOnly: true,
    async run(client, message, args){
        if(!message.member.hasPermission(8))return message.channel.send(`Nie możesz tego użyć`)
        const channel = message.mentions.channels.first()
        const channelID = client.channels.cache.find(c => c.id === args[0])
        const content = args.slice(1).join(' ')
        if(!channel){
            if(channelID){
                channelID.send(content)
            }
            else message.delete().then(()=> message.channel.send(args.join(' ')))
        }
        else if(channel){
            message.delete().then(()=> channel.send(content))
        }
    }
}