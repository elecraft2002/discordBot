const puppeteer = require("puppeteer")

async function screenshot(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 })
    await page.goto(url, {
        waitUntil: 'networkidle2',
    });
    const path = 'imgs/screenshot.png'
    await page.screenshot({ path });
    await browser.close();
    return path
}

module.exports.screenshot = screenshot