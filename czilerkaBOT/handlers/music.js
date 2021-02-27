const Discord = require('discord.js');
const ytdlDiscord = require("ytdl-core-discord");
module.exports = {
  async play(song, message) {
    const queue = message.client.queue.get(message.guild.id);
    
    
    if(!song) {
        queue.channel.leave();
        message.client.queue.delete(message.guild.id)
        return queue.textChannel.send("Lista utworów skończyła się").catch(console.error)
      
    }
    
    try {
      var stream = await ytdlDiscord(song.url, {
        highWaterMark: 1 << 25,
      });
      
    } catch (error) {
      if(queue) {
        queue.songs.shift()
        module.exports.play(queue.songs[0], message)
      }
      
      if(error.message.includes === "copyright") {
        return message.channel.send("Ten utwór posiada prawa autorskie")
      } else {
        console.error(error)
      }
    }
    
    const dispatcher = 
     queue.connection
    .play(stream, {type: "opus"}).on("finish", () => {
      if(queue.loop) {
        let lastsong = queue.songs.shift()
        queue.songs.push(lastsong)
        module.exports.play(queue.songs[0], message)
      } else {
        queue.songs.shift()
        module.exports.play(queue.songs[0], message)
      }
    }).on("error", console.error)
    
 
    dispatcher.setVolumeLogarithmic(queue.volume / 100); //VOLUME

    function czasowo(ilosc) {
      if (ilosc >= 3600) {
          var godz = (Math.floor(ilosc / 3600))
          var min = Math.floor((ilosc - godz * 3600) / 60)
          var sek = Math.floor((ilosc - (godz * 3600 + min * 60)) / 1)
          return `${godz}h ${min}m ${sek}s`
      }
      if (ilosc >= 60) {
          var min = (Math.floor(ilosc / 60))
          var sek = Math.floor((ilosc - (min * 60)) / 1)
          return `${min}m ${sek}s`
      }
      if (ilosc >= 1) {
          var sek = (Math.floor(ilosc / 1))
          return `${sek}s`
      }
      if (ilosc < 1) return `0s`
  }

    const exampleEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(song.title)
    .setURL(song.url)
    .setAuthor('Odtwarzanie utworu', `https://cdn.discordapp.com/avatars/735993989475598417/82577c38eb8beb55abb0e1e0463167c0.png?size=1024`)
    .addFields(
      { name: 'Czas utworu', value: `${czasowo(song.duration)}`, inline: true },
      { name: 'Autor', value: `${song.author}`, inline: true },
      { name: 'Data publikacji', value: `${song.data}`, inline: true },
      { name: 'Wyswietlenia', value: `${song.wyswietlenia}`, inline: true },
    )
    .setTimestamp()
    .setThumbnail(`https://img.youtube.com/vi/${song.id}/0.jpg`)
	.setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
  queue.textChannel.send(exampleEmbed);
  
    
    
  }
}