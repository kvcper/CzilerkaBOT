const discord = require("discord.js");
const db = require("quick.db");
module.exports = {
  name: "reactionrole",
  aliases: ["rr"],
  category: "Utility",
  description: "just reaction role",
  usage: "rr <create || add || remove> <name> <role> <emoji>",
  run: async (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_ROLES")) {
      let embed = new discord.MessageEmbed()
        .setTitle(`Missing Permission`)
        .setDescription("Nie masz uprawnień MANAGE_ROLES")
        .setColor("RED");
      let msg = await message.channel.send(embed);
      msg.delete({ timeout: 5000 });
      return;
    }
    if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
      let embed = new discord.MessageEmbed()
        .setTitle(`Missing Permission`)
        .setDescription("I don't have MANAGE_ROLES permission in this guild")
        .setColor("RED");
      let msg = await message.channel.send(embed);
      msg.delete({ timeout: 5000 });
      return;
    }
    if (!args[0]) {
      let embed = new discord.MessageEmbed()
      .setTitle(`Niewłaściwe użycie komendy!`)
      .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
      .setDescription(`Podaj co chcesz zrobić!`)
        .setColor("RED");
      let msg = await message.channel.send(embed);
      msg.delete({ timeout: 5000 });
      return;
    }
    if (args[0] == "create") {
      if (!args[1]) {
        let embed = new discord.MessageEmbed()
        .setTitle(`Podaj nazwe menu!`, client.user.avatarURL({dynamic:true}))
        .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
          .setDescription("")
          .setColor("RED");
        let msg = await message.channel.send(embed);
        msg.delete({ timeout: 5000 });
        return;
      }
      let menus = db.get(`rr_${message.guild.id}`);
      if (!menus) menus = [];
      for (let i = 0; i < menus.length; i++) {
        if (menus[i].Name == args[1]) {
          return message.channel.send(
            `Reaction Role menu with that name exists already`
          );
        }
      }
      if (!args[2]) {
        let embed = new discord.MessageEmbed()
          .setTitle(` Wrong Usage`)
          .setDescription("Provide type of reaction menu (multi, single)")
          .setColor("RED");
        let msg = await message.channel.send(embed);
        msg.delete({ timeout: 5000 });
        return;
      }
      let type;
      if (args[2].toLowerCase() == `single` || args[2].toLowerCase() == `multi`)
        type = args[2];
      else type = "multi";
      let reactionEmbed = new discord.MessageEmbed()
        .setTimestamp(Date.now())
        .setColor("RANDOM")
        .setAuthor('Czilerka Autorole', client.user.avatarURL());
      let msg = await message.channel.send(reactionEmbed);
      let MenuObject = {
        ChannelID: msg.channel.id,
        ID: msg.id,
        type: type,
        Name: args[1],
        color: "RANDOM",
        roles: [],
        usersReacted: []
      };
      db.push(`rr_${message.guild.id}`, MenuObject);

      let embed = new discord.MessageEmbed()
        .setAuthor(
          message.author.username,
          message.author.avatarURL({ dynamic: true })
        )
        .setTitle(` Role menu created`)
        .setDescription(
          `Menu ID: ${MenuObject.ID}\nMenu Nazwa: ${MenuObject.Name}\n aby dodać reakcje użyj <prefix> rr add ${MenuObject.Name} <role>`
        );
      let resmsg = await message.channel.send(embed);
      resmsg.delete({ timeout: 5000 });
      message.delete();
      return;
    }
    if (args[0] == "add") {
      let menus = db.get(`rr_${message.guild.id}`);
      if (!menus) {
        let embed = new discord.MessageEmbed()
          .setTitle(` Niewłaściwe użycie!`)
          .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
          .setDescription("Nie utworzyłeś menu!")
          .setColor("RED");
        let msg = await message.channel.send(embed);
        msg.delete({ timeout: 5000 });
        return;
      }
      if (!args[1]) {
        let embed = new discord.MessageEmbed()
          .setTitle(`Niewłaściwe użycie!`)
          .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
          .setDescription("Prosze podać nazwe menu!")
          .setColor("RED");
        let msg = await message.channel.send(embed);
        msg.delete({ timeout: 5000 });
        return;
      }
      let menu;
      let index;
      for (let i = 0; i < menus.length; i++) {
        if (menus[i].Name == args[1]) {
          menu = menus[i];
          index = i;
        }
      }
      if (!menu) {
        let embed = new discord.MessageEmbed()
          .setTitle(`Niewłaściwe użycie!`)
          .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
          .setDescription("Nie znaleziono roli menu!")
          .setColor("RED");
        let msg = await message.channel.send(embed);
        msg.delete({ timeout: 5000 });
        return;
      }
      if (menu.roles.length > 20) {
        let embed = new discord.MessageEmbed()
          .setTitle(` Niewłaściwe użycie!`)
          .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
          .setDescription(
            "W tym menu reakcji jest już 20 reakcji!"
          )
          .setColor("RED");
        let msg = await message.channel.send(embed);
        msg.delete({ timeout: 5000 });
        return;
      }
      let role =
        message.mentions.roles.first() ||
        message.guild.roles.cache.find(x => x.id == args[2]);
      if (!role) {
        let embed = new discord.MessageEmbed()
          .setTitle(` Niewłaściwe użycie!`)
          .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
          .setDescription("Nie znaleziony takiej roli!")
          .setColor("RED");
        let msg = await message.channel.send(embed);
        msg.delete({ timeout: 5000 });
        return;
      }
      for (let i = 0; i < menu.roles.lenght; i++) {
        if (menu.roles[i].role == role.id) {
          return message.channel.send(
            "Reakcja z tą rolą jest już w tym menu"
          );
        }
      }
      let embed = new discord.MessageEmbed()
        .setTitle("Proszę zareagować emoji, które chcesz ustawić pod tą wiadomością")
        .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
        .setDescription("Ostrzeżenie! Bot potrzebuje dostępu do emoji, aby go używać!");
      let msg = await message.channel.send(embed);
      let reaction = await msg
        .awaitReactions((reaction, user) => user.id == message.author.id, {
          max: 1,
          time: 60000,
          errors: ["time"]
        })
        .catch(async time => {
          let embed1 = new discord.MessageEmbed()
            .setTitle(` Niewłaściwe użycie`)
            .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
            .setDescription("Koniec czasu")
            .setColor("RED");
          msg.edit(embed1);
          msg.delete({ timeout: 5000 });
          return;
        });
      reaction = await reaction.first();
      let checkReaction =
        client.emojis.cache.find(x => x.id == reaction.emoji.id) ||
        client.emojis.cache.find(x => x.name == reaction.emoji.name);
      let check = false;
      check = reaction.emoji.id ? checkReaction : true;
      if (!check) {
        let embed = new discord.MessageEmbed()
          .setTitle(` Niewłaściwe użycie!`)
          .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
          .setDescription("Nie znaleziono emotikonów na liście emotikonów botów!")
          .setColor("RED");
        let msg = await message.channel.send(embed);
        msg.delete({ timeout: 5000 });
        return;
      }
      let chl = message.guild.channels.cache.find(x => x.id == menu.ChannelID);
      if (!chl) {
        let embed = new discord.MessageEmbed()
          .setTitle(` Niewłaściwe użycie!`)
          .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
          .setDescription(
            "Nie znaleziono kanału z tym menu. Usunąłeś go?"
          )
          .setColor("RED");
        let msg = await message.channel.send(embed);
        msg.delete({ timeout: 5000 });
        return;
      }
      let rmsg = await chl.messages.fetch(menu.ID);
      if (!rmsg) {
        let embed = new discord.MessageEmbed()
          .setTitle(` Niewłaściwe użycie!`)
          .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
          .setDescription(
            "Nie znaleziono wiadomości z tym menu, czy ją usunąłeś?"
          )
          .setColor("RED");
        let msg = await message.channel.send(embed);
        msg.delete({ timeout: 5000 });
        return;
      }

      let reactionRole = {
        role: role.id,
        custom: reaction.emoji.id ? true : false,
        reaction: reaction.emoji.id ? reaction.emoji.id : reaction.emoji.name,
        emoji: reaction.emoji.animated
          ? `<a:${reaction.emoji.name}:${reaction.emoji.id}>`
          : `<:${reaction.emoji.name}:${reaction.emoji.id}>`
      };

      rmsg.react(reactionRole.reaction);
      menu.roles.push(reactionRole);
      menus[index] = menu;
      let desc = [];
      for (let i = 0; i < menu.roles.length; i++) {
        menu.roles[i].custom
          ? desc.push(`${menu.roles[i].emoji} <@&${menu.roles[i].role}>`)
          : desc.push(`${menu.roles[i].reaction} <@&${menu.roles[i].role}>`);
      }
      embed = new discord.MessageEmbed()
        .setTitle(menu.Name)
        .setDescription(desc.join("\n"))
        .setColor(menu.color);
      rmsg.edit(embed);
      db.set(`rr_${message.guild.id}`, menus);
      embed = new discord.MessageEmbed()
        .setTitle("Udane!")
        .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
        .setDescription("Dodano rolę do menu reakcji");
      msg.edit(embed);
      msg.delete({ timeout: 5000 });
      message.delete();
    }
    if (args[0] == "color") {
      if (!args[1])
        return message.channel.send(`Proszę podać nazwę menu reakcji`);
      let menus = db.get(`rr_${message.guild.id}`);
      if (!menus) {
        let embed = new discord.MessageEmbed()
          .setTitle(` Niewłaściwe użycie`)
          .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
          .setDescription("Nie utworzono menu!")
          .setColor("RED");
        let msg = await message.channel.send(embed);
        msg.delete({ timeout: 5000 });
        return;
      }
      let menu;
      let index;
      for (let i = 0; i < menus.length; i++) {
        if (menus[i].Name == args[1]) {
          menu = menus[i];
          index = i;
        }
      }
      if (!menu) {
        let embed = new discord.MessageEmbed()
          .setTitle(` Niewłaściwe użycie!`)
          .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
          .setDescription("Nie można znaleźć menu roli o tej nazwie")
          .setColor("RED");
        let msg = await message.channel.send(embed);
        msg.delete({ timeout: 5000 });
        return;
      }
      let rchl = await message.guild.channels.cache.find(
        x => x.id == menu.ChannelID
      );
      if (!rchl) {
        let embed = new discord.MessageEmbed()
          .setTitle(`Niewłaściwe użycie!`)
          .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
          .setDescription(
            "Nie znaleziono kanału z tym menu!"
          )
          .setColor("RED");
        let msg = await message.channel.send(embed);
        msg.delete({ timeout: 5000 });
        return;
      }
      let rmsg = await rchl.messages.fetch(menu.ID);
      if (!rmsg) {
        let embed = new discord.MessageEmbed()
          .setTitle(` Wrong Usage`)
          .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
          .setDescription(
            "Nie znaleziono wiadomości z tym menu! "
          )
          .setColor("RED");
        let msg = await message.channel.send(embed);
        msg.delete({ timeout: 5000 });
        return;
      }
      if (!args[2])
        return message.channel.send(`Podaj kolor szesnastkowy do ustawienia`);
      let hex = /^#[0-9A-F]{6}$/i;
      if (hex.test(args[2])) {
        let desc;
        if (!menu.desc) {
          desc = [];
          for (let i = 0; i < menu.roles.length; i++) {
            menu.roles[i].custom
              ? desc.push(`${menu.roles[i].emoji} <@&${menu.roles[i].role}>`)
              : desc.push(
                  `${menu.roles[i].reaction} <@&${menu.roles[i].role}>`
                );
          }
        }else{
          desc = menu.desc
        }
        menu.color = args[2];
        menus[index] = menu;
        db.set(`rr_${message.guild.id}`, menus);
        let embed = new discord.MessageEmbed()
          .setDescription(desc)
          .setColor(args[2])
        .setAuthor('Czilerka Autorole', client.user.avatarURL());
        rmsg.edit(embed);
        let resmsg = await message.channel.send(`Zmieniono kolor na ${args[2]}`);
        resmsg.delete({ timeout: 5000 });
        message.delete();
      } else {
        return message.channel.send(`Podany argument nie jest szesnastkowy!`);
      }
    }
    if (args[0] == "remove") {
      let menus = db.get(`rr_${message.guild.id}`);
      if (!menus) {
        let embed = new discord.MessageEmbed()
          .setTitle(` Niewłaściwe użycie!`)
          .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
          .setDescription("Nie utworzono menu!")
          .setColor("RED");
        let msg = await message.channel.send(embed);
        msg.delete({ timeout: 5000 });
        return;
      }
      if (!args[1]) {
        let embed = new discord.MessageEmbed()
          .setTitle(` Niewłaściwe użycie!`)
          .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
          .setDescription("Prosze podać nazwe menu!")
          .setColor("RED");
        let msg = await message.channel.send(embed);
        msg.delete({ timeout: 5000 });
        return;
      }
      let menu;
      let index;
      for (let i = 0; i < menus.length; i++) {
        if (menus[i].Name == args[1]) {
          menu = menus[i];
          index = i;
        }
      }
      if (!menu) {
        let embed = new discord.MessageEmbed()
          .setTitle(` Niewłaściwe użycie!`)
          .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
          .setDescription("Nie znaleziono w menu roli!")
          .setColor("RED");
        let msg = await message.channel.send(embed);
        msg.delete({ timeout: 5000 });
        return;
      }
      let role =
        message.mentions.roles.first() ||
        message.guild.roles.cache.find(x => x.id == args[2]);
      if (!role) {
        let embed = new discord.MessageEmbed()
          .setTitle(` Niewłaściwe użycie!`)
          .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
          .setDescription("Podaj ID roli lub oznacz role!")
          .setColor("RED");
        let msg = await message.channel.send(embed);
        msg.delete({ timeout: 5000 });
        return;
      }

      let rchl = await message.guild.channels.cache.find(
        x => x.id == menu.ChannelID
      );
      if (!rchl) {
        let embed = new discord.MessageEmbed()
          .setTitle(` Niewłaściwe użycie!`)
          .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
          .setDescription(
            "Nie znaleziono kanału z tym menu!"
          )
          .setColor("RED");
        let msg = await message.channel.send(embed);
        msg.delete({ timeout: 5000 });
        return;
      }
      let rmsg = await rchl.messages.fetch(menu.ID);
      if (!rmsg) {
        let embed = new discord.MessageEmbed()
          .setTitle(` Niewłaściwe użycie!`)
          .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
          .setDescription(
            "Nie znaleziono wiadomości z tym menu!"
          )
          .setColor("RED");
        let msg = await message.channel.send(embed);
        msg.delete({ timeout: 5000 });
        return;
      }
      let roleCheck = false;
      let roleIndex;
      for (let i = 0; i < menu.roles.length; i++) {
        if (menu.roles[i].role == role.id) {
          roleCheck = true;
          roleIndex = i;
        }
      }
      if (roleCheck) {
        rmsg.reactions.cache.get(menu.roles[roleIndex].reaction).remove();
        menu.roles.splice(roleIndex, 1);
        menus[index] = menu;
        db.set(`rr_${message.guild.id}`, menus);
        let desc = [];
        for (let i = 0; i < menu.roles.length; i++) {
          menu.roles[i].custom
            ? desc.push(`${menu.roles[i].emoji} <@&${menu.roles[i].role}>`)
            : desc.push(`${menu.roles[i].reaction} <@&${menu.roles[i].role}>`);
        }
        let embed = new discord.MessageEmbed()
          .setDescription(desc.join("\n"))
          .setColor(menu.color)
          .setAuthor('Czilerka', client.user.avatarURL());
        rmsg.edit(embed);

        let resmsg = await message.channel.send(`Usunięte reaction roles!`);
        resmsg.delete({ timeout: 5000 });
        message.delete();
      } else {
        message.channel.send(`Ta rola w menu nie istnieje!!`);
      }
    }
    if (args[0] == "desc") {
      if (!args[1])
        return message.channel.send(`Proszę podać nazwę menu reakcji!`);
      let menus = db.get(`rr_${message.guild.id}`);
      if (!menus) {
        let embed = new discord.MessageEmbed()
          .setTitle(`Niewłaściwe użycie!`)
          .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
          .setDescription("Nie utworzono menu!")
          .setColor("RED");
        let msg = await message.channel.send(embed);
        msg.delete({ timeout: 5000 });
        return;
      }
      let menu;
      let index;
      for (let i = 0; i < menus.length; i++) {
        if (menus[i].Name == args[1]) {
          menu = menus[i];
          index = i;
        }
      }
      if (!menu) {
        let embed = new discord.MessageEmbed()
          .setTitle(`Niewłaściwe użycie!`)
          .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
          .setDescription("Nie można znaleźć roli w menu o tej nazwie!")
          .setColor("RED");
        let msg = await message.channel.send(embed);
        msg.delete({ timeout: 5000 });
        return;
      }
      let rchl = await message.guild.channels.cache.find(
        x => x.id == menu.ChannelID
      );
      if (!rchl) {
        let embed = new discord.MessageEmbed()
          .setTitle(`Niewłaściwe użycie!`)
          .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
          .setDescription(
            "Nie znaleziono kanału z tym menu"
          )
          .setColor("RED");
        let msg = await message.channel.send(embed);
        msg.delete({ timeout: 5000 });
        return;
      }
      let rmsg = await rchl.messages.fetch(menu.ID);
      if (!rmsg) {
        let embed = new discord.MessageEmbed()
          .setTitle(`Niewłaściwe użycie!`)
          .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
          .setDescription(
            "Nie znaleziono wiadomości z tym menu!"
          )
          .setColor("RED");
        let msg = await message.channel.send(embed);
        msg.delete({ timeout: 5000 });
        return;
      }
      if (!args[2]) return message.channel.send(`Proszę podać opis!`);
      let description = message.content.slice(13).split("!n");
      menu.desc = description;
      menus[index] = menu;
      db.set(`rr_${message.guild.id}`, menus);
      let embed = new discord.MessageEmbed()
        .setDescription(description)
        .setColor(menu.color)
        .setAuthor('Czilerka', client.user.avatarURL());
      rmsg.edit(embed);
      let resmsg = await message.channel.send(`Zmieniono opis wiadomosci`);
      resmsg.delete({ timeout: 5000 });
      message.delete();
    }
    if(args[0].toLowerCase() == "delete" || args[0].toLowerCase() == "del") {
      let name = args[1]
      if(!name) {
        let embed = new discord.MessageEmbed()
          .setTitle(`Niewłaściwe użycie!`)
          .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
          .setDescription("Podaj nazwe menu!")
          .setColor("RED");
        let msg = await message.channel.send(embed);
        msg.delete({ timeout: 5000 });
        return;
      }
      let menus = db.get(`rr_${message.guild.id}`)
      let menu;
      let menuIndex;
      if(!menus) {
        let embed = new discord.MessageEmbed()
          .setTitle(`Niewłaściwe użycie!`)
          .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
          .setDescription("Nie ma menu ról!")
          .setColor("RED");
        let msg = await message.channel.send(embed);
        msg.delete({ timeout: 5000 });
        return;
      }
      for(let i = 0; i < menus.length; i++) {
        if(menus[i].Name.toLowerCase() == name.toLowerCase()) {
          menu = menus[i]
          menuIndex = i
        }
      }
      if(!menu && menuIndex != -1) {
        let embed = new discord.MessageEmbed()
          .setTitle(` Niewłaściwe użycie!`)
          .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
          .setDescription("Nie można znaleźć menu roli o tej nazwie!")
          .setColor("RED");
        let msg = await message.channel.send(embed);
        msg.delete({ timeout: 5000 });
        return;
      }
      menus.splice(menuIndex, 1)
      db.set(`rr_${message.guild.id}`, menus)
      let embed = new discord.MessageEmbed()
      .setAuthor(`Czilerka`, client.user.avatarURL({dynamic:true}))
          .setDescription(`Menu ról z nazwą ${menu.Name} została usnięta!`)
          .setColor("RED");
      return message.channel.send(embed);
    }
  }
};
