module.exports = {
    name: 'nickname',
    async run(client , message, args){
        const member = message.mentions.members.first()
        const memberID = message.guild.members.cache.get(args[0])
        const nickname = args.slice(1).join(' ')
        if(!message.member.hasPermission('MANAGE_NICKNAMES'))return message.channel.send(`Nie mam uprawnień żeby to zrobić`)
        if(!member){
            if(memberID){
                if(!memberID.manageable)return message.channel.send(`Nie mogę zmienić temu użytkownikowi tego nicku`)
                if(!nickname)return message.channel.send(`Nie podałeś nicku`)
                if(nickname.length > 32)return message.channel.send(`Za długi argument`)
                if(nickname === 'brak'){
                    await memberID.setNickname(null)
                    message.channel.send(`Pomyślnie usunięto nick ${memberID.user.tag}`)
                    return
                }
                await memberID.setNickname(nickname)
                message.channel.send(`Pomyślnie ustawiono nick dla ${memberID.user.tag} na ${nickname}`)
                return
            }
            else return
        }
        else if(member){
            if(!member.manageable)return message.channel.send(`Nie mogę zmienić temu użytkownikowi nicku`)
            if(!nickname)return message.channel.send(`Nie podałeś nicku`)
            if(nickname.length > 32)return message.channel.send(`Za długi argument`)
            if(nickname === 'brak'){
                await member.setNickname(null)
                message.channel.send(`Pomyślnie usunięto nick z ${member.user.tag}`)
                return
            }
            await member.setNickname(nickname)
            message.channel.send(`Pomyślnie ustawiono nick dla ${member.user.tag} na ${nickname}`)
        }
        
    }
}