const path = require("node:path");
const puppeteer = require("puppeteer");

async function scroll(page) {
  return await page.evaluate(async () => {
    return await new Promise((resolve, _reject) => {
      const i = setInterval(() => {
        window.scrollBy(0, window.innerHeight);
        if (document.scrollingElement.scrollTop + window.innerHeight >= document.scrollingElement.scrollHeight) {
          window.scrollTo(0, 0);
          clearInterval(i);
          resolve();
        }
      }, 100);
    });
  });
}

function fileExtension(filename) {
  const extension = path.extname(filename);

  if (extension.startsWith(`.`)) {
    return extension.substr(1);
  }

  return extension;
}

async function htmlToImage(url, imageFilename) {
  const browser = await puppeteer.launch({ headless: true });

  try {
    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 1024 });
    await page.goto(url, { waitUntil: ["load", "domcontentloaded"] });
    await scroll(page);
    await page.screenshot({
      type: fileExtension(imageFilename),
      path: imageFilename,
      fullPage: true,
    });
  } finally {
    await browser.close();
  }
}

async function main() {
  await Promise.all([
    htmlToImage(`https://cv.nunorodrigues.tech/`, `generated/current.png`),
    htmlToImage(`file://${path.resolve("./generated/cv.html")}`, `generated/this.png`),
  ]);
}

main();
