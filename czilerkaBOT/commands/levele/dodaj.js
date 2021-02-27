const db = require("quick.db")
const Discord = require("discord.js")
const fs = require('fs');
var latinize = require('latinize');

Number.isInteger = Number.isInteger || function (value) {
    return typeof value === 'number' &&
        isFinite(value) &&
        Math.floor(value) === value;
};

function toLower(text) {
    return text.toLowerCase();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const wojewodztwa = [
    `wielkopolskie`,
    `kujawsko-pomorskie`,
    `malopolskie`,
    `lodzkie`,
    `dolnoslaskie`,
    `lubelskie`,
    `lubuskie`,
    `mazowieckie`,
    `opolskie`,
    `podlaskie`,
    `pomorskie`,
    `slaskie`,
    `podkarpackie`,
    `swietokrzyskie`,
    `warminsko-mazurskie`,
    `zachodniopomorskie`
]

module.exports = {
    name: "dodaj",
    run: async (client, message, args) => {
        var levele = new db.table('levele')
        if (args[0] == `user`) {
            let userinfo = levele.get(`userinfo_${message.member.id}`)
            if (!userinfo) {
                userinfo = {
                    imie: "-",
                    wiek: "-",
                    wojewodztwo: "-",
                    email: "-",
                    plec: "-",
                    data: "-",
                    wzrost: "-",
                    zainteresowania: ""
                }
            }
            if (toLower(latinize(args[1])) == `wiek`) {
                const wiek = parseInt(args[2])
                if (isNaN(wiek)) return message.channel.send("Podaj prawidłowy wiek!")
                if (wiek >= 13 && wiek < 31) {
                    userinfo.wiek = wiek
                    levele.set(`userinfo_${message.member.id}`, userinfo)
                    return message.channel.send(`Gratuluje! Ustawiłes właśnie swój wiek na \`${wiek}\``)
                } else return message.channel.send("Podaj prawidłowy wiek!")
            } if (toLower(latinize(args[1])) == `imie`) {
                if (!args[2]) return message.channel.send("Podaj imię!")
                if (args[2] === '@everyone') return message.channel.send("Podałeś błędne zainteresowanie!")
                if (args[2].startsWith('discord.gg/' || args[2].startsWith('http://') || args[2].startsWith('https://'))) return message.channel.send("Podałeś błędne zainteresowanie!")
                userinfo.imie = args[2]
                levele.set(`userinfo_${message.member.id}`, userinfo)
                message.channel.send(`Gratuluje! Ustawiłes właśnie swoje imie ${args[2]}`)
            } if (toLower(latinize(args[1])) == `wojewodztwo`) {
                if (!args[2]) return message.channel.send("Podaj wojewodztwo!")
                if (args[2] === '@everyone') return message.channel.send("Podałeś błędne zainteresowanie!")
                if (args[2].startsWith('discord.gg/' || args[2].startsWith('http://') || args[2].startsWith('https://'))) return message.channel.send("Podałeś błędne zainteresowanie!")
                let wojewodztwo = args[2];
                wojewodztwo = latinize(wojewodztwo);
                wojewodztwo = toLower(wojewodztwo)
                if (wojewodztwa.includes(wojewodztwo)) {
                    message.channel.send(`Gratuluje! Ustawiłes właśnie województwo ${wojewodztwo}!`)
                    userinfo.wojewodztwo = capitalizeFirstLetter(wojewodztwo)
                    levele.set(`userinfo_${message.member.id}`, userinfo)
                } else return message.channel.send("Podaj wojewodztwo!")
            } if (toLower(latinize(args[1])) == `email` || toLower(latinize(args[1])) == `e-mail`) {
                if (!args[2]) return message.channel.send("Podaj email!")
                if (args[2] === '@everyone') return message.channel.send("Podałeś błędne zainteresowanie!")
                if (args[2].startsWith('discord.gg/' || args[2].startsWith('http://') || args[2].startsWith('https://'))) return message.channel.send("Przykro mi! Nie możesz użyć w zainteresowaniach linku z zaproszeniem!")
                if (args[2].includes(`@`)) {
                    if (args[2].length < 29 && args[2].length > 5) {
                        message.channel.send(`Gratuluje! Ustawiłes właśnie email na ${args[2]}`)
                        userinfo.email = args[2]
                        levele.set(`userinfo_${message.member.id}`, userinfo)
                    } else return message.channel.send("Podaj poprawny email!")
                } else return message.channel.send("Podaj poprawny email!")
            } if (toLower(latinize(args[1])) == `plec`) {
                if (!args[2]) return message.channel.send("Podaj plec!")
                if (args[2] === '@everyone') return message.channel.send("Przykro mi! Nie możesz użyć eveyrone w zainteresowaniach!")
                if (args[2].startsWith('discord.gg/' || args[2].startsWith('http://') || args[2].startsWith('https://'))) return message.channel.send("Przykro mi! Nie możesz użyć w zainteresowaniach linku z zaproszeniem!")
                let plec = latinize(args[2]).toLowerCase()
                if (plec == `mezczyzna`) {
                    message.channel.send(`Gratuluje! Ustawiłes właśnie swoją płeć na Mężczyzna`)
                    userinfo.plec = "Mężczyzna"
                    return levele.set(`userinfo_${message.member.id}`, userinfo)
                } if (plec == `kobieta`) {
                    message.channel.send(`Gratuluje! Ustawiłes właśnie swoją płeć na Kobieta`)
                    userinfo.plec = "Kobieta"
                    return levele.set(`userinfo_${message.member.id}`, userinfo)
                } else
                    return message.channel.send("Podaj poprawną płeć!")
            } if (toLower(latinize(args[1])) == `wzrost`) {
                if (!args[2]) return message.channel.send("Podaj prawidłowy wzrost!")
                const wzrost = parseInt(args[2])
                if (isNaN(wzrost)) return message.channel.send("Podaj prawidłowy wzrost!")
                if (wzrost >= 140 && wzrost < 221) {
                    userinfo.wzrost = wzrost
                    levele.set(`userinfo_${message.member.id}`, userinfo)
                    return message.channel.send(`Gratuluje! Ustawiłes swój wzrost na ${wzrost}`)
                } else return message.channel.send(`podaj prawidłowy wzrost`)
            } if (toLower(latinize(args[1])) == `zainteresowania`) {
                if (!args[2]) return message.channel.send("Podaj prawdłowe zainteresowania!")
                if (args[2] === '@everyone') return message.channel.send("Podałeś błędne zainteresowanie!")
                if (args[2].startsWith('discord.gg/' || args[2].startsWith('http://') || args[2].startsWith('https://'))) return message.channel.send("Podałeś błędne zainteresowanie!")
                if (levele.get(`zainteresowania_${message.member.id}`)) {
                    if ((levele.get(`zainteresowania_${message.member.id}`)).length >= 10) {
                        return message.channel.send(`Maksymalnie 10 zainteresowan`)
                    }
                }
                let zainteresowania = args.slice(2).join(` `)
                userinfo.zainteresowania = zainteresowania
                levele.set(`userinfo_${message.member.id}`, userinfo)
                message.channel.send(`Gratuluje! Ustawiłes właśnie swoje zainteresowania na ${zainteresowania}`)
            } if (toLower(latinize(args[1])) == `data`) {
                if (toLower(latinize(args[2])) == `urodzenia` || toLower(latinize(args[2])) == `urodzin`) {
                    let data = /([0-3])([0-9])\/([0-1])([0-9])\/([0-2])([0-9])([0-9])([0-9])/;
                    if (data.test(args[3])) {
                        let uro = args[3].split(`/`)
                        let dzien = uro[0]
                        let miesiac = uro[1]
                        let rok = uro[2]
                        if (dzien < 32 && dzien > 00 && miesiac < 13 && miesiac > 0 && rok < 2008 && rok > 1980) {
                            userinfo.data = args[3]
                            levele.set(`userinfo_${message.member.id}`, userinfo)
                            message.channel.send(`Gratuluje! Ustawiłes właśnie swoją date urodzenia na ${args[3]}`)
                        } else return message.channel.send("Podaj prawidłową datę urodzenia!")
                    } else {
                        data = /([0-3])([0-9])\.([0-1])([0-9])\.([0-2])([0-9])([0-9])([0-9])/;
                        if (data.test(args[3])) {
                            let uro = args[3].split(`.`)
                            let dzien = uro[0]
                            let miesiac = uro[1]
                            let rok = uro[2]
                            if (dzien < 32 && dzien > 00 && miesiac < 13 && miesiac > 0 && rok < 2008 && rok > 1980) {
                                userinfo.data = args[3]
                                levele.set(`userinfo_${message.member.id}`, userinfo)
                                return message.channel.send(`Gratuluje! Ustawiłes właśnie swoją date urodzenia na ${args[3]}`)
                            } else return message.channel.send("Podaj prawidłową datę urodzenia!")
                        } return message.channel.send("Podaj prawidłową datę urodzenia!")
                    }
                }
            }
        }
    }
}