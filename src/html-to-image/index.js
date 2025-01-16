const path = require("node:path");
const puppeteer = require("puppeteer");

const HD_RESOLUTION = { width: 1920, height: 1080 };
const MOBILE_RESOLUTION = { width: 412, height: 915, isMobile: true }; // Pixel 7 portrait mode

const DARK_COLOR_SCHEME = `dark`;
const LIGHT_COLOR_SCHEME = `light`;

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

async function htmlToImage(url, imageFilename, viewport = HD_RESOLUTION, prefersColorScheme = LIGHT_COLOR_SCHEME) {
  const browser = await puppeteer.launch({ headless: true });

  try {
    const page = await browser.newPage();

    await page.setViewport(viewport);
    await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: prefersColorScheme }]);
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
  const currentUrl = `https://cv.nunorodrigues.tech/`;
  const newUrl = `file://${path.resolve("./generated/cv.html")}`;

  await Promise.all([
    htmlToImage(currentUrl, `generated/current.hd.dark.png`, HD_RESOLUTION, DARK_COLOR_SCHEME),
    htmlToImage(currentUrl, `generated/current.hd.light.png`, HD_RESOLUTION, LIGHT_COLOR_SCHEME),
    htmlToImage(currentUrl, `generated/current.mobile.dark.png`, MOBILE_RESOLUTION, DARK_COLOR_SCHEME),
    htmlToImage(currentUrl, `generated/current.mobile.light.png`, MOBILE_RESOLUTION, LIGHT_COLOR_SCHEME),
    htmlToImage(newUrl, `generated/new.hd.dark.png`, HD_RESOLUTION, DARK_COLOR_SCHEME),
    htmlToImage(newUrl, `generated/new.hd.light.png`, HD_RESOLUTION, LIGHT_COLOR_SCHEME),
    htmlToImage(newUrl, `generated/new.mobile.dark.png`, MOBILE_RESOLUTION, DARK_COLOR_SCHEME),
    htmlToImage(newUrl, `generated/new.mobile.light.png`, MOBILE_RESOLUTION, LIGHT_COLOR_SCHEME),
  ]);
}

main();
