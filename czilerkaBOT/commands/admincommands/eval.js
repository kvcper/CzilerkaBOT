const ownerID = ["", ""]
const db = require("quick.db");
const Discord = require("discord.js");
const clean = text => {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}  
module.exports = {
  name: 'eval',
  triggers: [
		["eval"],
	],
    description: 'just info',
run: (client, message, args) => {
  const code = args.join(" ");

  if(!ownerID.includes(message.author.id)) return message.channel.send("Przykro mi, Nie mozesz uzyc tej komendy!")
    if(code.toLowerCase().includes("token")||code.toLowerCase().includes("config") || code.toLowerCase().includes("ytapikey") || code.toLowerCase().includes("destroy")) return message.channel.send("For safety reason I won't do it") 
    try {
      
      let evaled = eval(code);
      
 
      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);
 
      message.channel.send(clean(evaled), {code:"xl"});
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
      

}}