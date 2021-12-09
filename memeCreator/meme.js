'use strict';
const puppeteer = require("puppeteer")
const fs = require("fs")

async function createMeme(url, top, bottom, width, height) {
    console.log("rendering")
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Meme xd</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <img src="${url}">
        <p class="top">${top}</p>
        <p class="bottom">${bottom}</p>
    </body>
    </html>`
    fs.writeFile("memeCreator/index.html", html, err => {
        if (err)
            console.log(err)
    })
    console.log(__dirname + "/index.html")
    const browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ],
      });
    const page = await browser.newPage();
    await page.setViewport({ width, height })
    await page.goto(__dirname + "/index.html");
    const path = 'imgs/meme.png'
    await page.screenshot({ path });
    await browser.close();
    return path
}


module.exports.createMeme = createMeme