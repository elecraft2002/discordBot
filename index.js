require('dotenv').config(); //initialize dotenv
const { channel } = require('diagnostics_channel');
const Discord = require('discord.js'); //import discord.js
const { disconnect, config } = require('process');
const webRender = require("./webRender")

const client = new Discord.Client({
    intents: [Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES]
}); //create new client


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
    const args = message.content.trim().split(" ")
    const command = args[0]

    if (command === "!screenshot") {
        let url = ""
        try {
            url = args[1]
        } catch (error) {
            message.channel.send("Use format /screenshot www.example.com")
            return
        }
        async function send() {
            let path = ""
            try {
                path = await webRender.screenshot(url)
            } catch (error) {
                message.channel.send("Url is invalid")
                return
            }
            message.channel.send({
                files: [{
                    attachment: path,
                    name: 'screenshot.png'
                }]
            });
        }
        send()
    }
    //Reply
    if (message.reference != null) {
        if (message.content.includes("!top") || message.content.includes("!bottom")) {
            async function reply() {
                const img = await getMessage(message.reference.messageId)
                async function getMessage(id) {
                    let imgUrl = ""
                    let referenceMsg = await message.channel.messages.fetch(id)
                    //console.log(referenceMsg)
                    if (referenceMsg.attachments.size > 0) {
                        referenceMsg.attachments.forEach(e => {
                            imgUrl = e
                            return
                        })
                    }
                    return imgUrl
                }

                //Format top text
                let top = ""
                let isTop = false
                let words = message.content.split(" ")
                for (let i = 0; i < words.length; i++) {
                    const word = words[i];
                    if (word.includes("!top") || isTop) {
                        isTop = true
                        if (word == "!bottom") {
                            isTop = false
                            break
                        }
                        if (word != "!top") {
                            top += " " + word
                        }
                    }
                }
                //Format bottom text
                let bottom = ""
                let isBottom = false
                for (let i = 0; i < words.length; i++) {
                    const word = words[i];
                    if (word.includes("!bottom") || isBottom) {
                        isBottom = true
                        if (word == "!top") {
                            isBottom = false
                            break
                        }
                        if (word != "!bottom") {
                            bottom += " " + word
                        }
                    }
                }
                //Url obrázku
                console.log(img.url)
                let width = 1080
                let height = 1080
                try {
                    width = img.width
                    height = img.height
                } catch (error) {
                    console.log(error)
                }
                console.log(top)
                console.log(bottom)
                const meme = require("./public/memeCreator/meme")
                try {
                    const path = await meme.createMeme(img.url, top, bottom, width, height)
                    message.channel.send({
                        files: [{
                            attachment: path,
                            name: 'meme.png'
                        }]
                    });
                } catch (error) {
                    console.log(error)
                }

            }
            reply()
        }
    }
});

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token