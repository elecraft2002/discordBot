'use strict';
const puppeteer = require("puppeteer")
const fs = require("fs")
const filePath = require("path")
require('dotenv').config()

async function createMeme(url, top, bottom, width, height) {
    console.log("rendering")
    console.log(process.env.URL_PATH + "/memeCreator/index.html")
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ],
    });
    const page = await browser.newPage();
    await page.setViewport({ width, height })
    await page.goto(process.env.URL_PATH + "/memeCreator/index.html");
    const path = 'public/imgs/meme.png'
    await page.evaluate((url, top, bottom) => {
        document.getElementById("img").src = url
        document.getElementById("top").innerText = top
        document.getElementById("bottom").innerText = bottom
    }, url, top, bottom)
    await page.waitForSelector("#img")
    await page.screenshot({ path });
    await browser.close();
    return path
}


module.exports.createMeme = createMeme