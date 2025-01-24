import { htmlToImage, htmlToPdf, newBrowser, RESOLUTION } from "./puppeteer.ts";

// Generate screenshots and PDFs of `https://cv.nunorodrigues.tech/` and `generated/cv.html` for visual comparison.
async function main() {
  const basePath = new URL(`../generated`, import.meta.url).pathname;

  const currentUrl = `https://cv.nunorodrigues.tech/`;
  const newUrl = `file://${basePath}/cv.html`;

  const browser = await newBrowser();

  try {
    await Promise.all([
      htmlToImage(currentUrl, `${basePath}/current.hd.dark.png`, RESOLUTION.HD, `dark`, browser),
      htmlToImage(currentUrl, `${basePath}/current.hd.light.png`, RESOLUTION.HD, `light`, browser),
      htmlToImage(currentUrl, `${basePath}/current.mobile.dark.png`, RESOLUTION.MOBILE, `dark`, browser),
      htmlToImage(currentUrl, `${basePath}/current.mobile.light.png`, RESOLUTION.MOBILE, `light`, browser),
      htmlToPdf(currentUrl, `${basePath}/current.pdf`, browser),
      htmlToImage(newUrl, `${basePath}/new.hd.dark.png`, RESOLUTION.HD, `dark`, browser),
      htmlToImage(newUrl, `${basePath}/new.hd.light.png`, RESOLUTION.HD, `light`, browser),
      htmlToImage(newUrl, `${basePath}/new.mobile.dark.png`, RESOLUTION.MOBILE, `dark`, browser),
      htmlToImage(newUrl, `${basePath}/new.mobile.light.png`, RESOLUTION.MOBILE, `light`, browser),
      htmlToPdf(newUrl, `${basePath}/new.pdf`, browser),
    ]);
  } finally {
    await browser.close();
  }
}

await main();
