import puppeteer from "puppeteer";

export const RESOLUTION: { [viewport: string]: puppeteer.Viewport } = {
  HD: { width: 1920, height: 1080 },
  MOBILE: { width: 412, height: 915, isMobile: true }, // Pixel 7 portrait mode
};

type ColorScheme = `dark` | `light`;

// scrollToBottom scrolls the page to the bottom and back to the top.
// This helps fix a problem with infinite scroll pages not properly rendering when taking a screenshot.
async function scrollToBottom(page: puppeteer.Page) {
  // Define `window` and `document` as any to avoid deno linting errors on the `page.evaluate` function.
  const window: any = null;
  const document: any = null;

  return await page.evaluate(async () => {
    return await new Promise((resolve, _reject) => {
      const i = setInterval(() => {
        window.scrollBy(0, window.innerHeight);
        if (document.scrollingElement.scrollTop + window.innerHeight >= document.scrollingElement.scrollHeight) {
          window.scrollTo(0, 0);
          clearInterval(i);
          resolve(null);
        }
      }, 100);
    });
  });
}
export async function newBrowser() {
  return await puppeteer.launch({
    headless: true,
    // Run chrome in no sandbox mode to workaround the `No usable sandbox!` error when running in Github Actions.
    // Since we only use chrome for HTML generated from this repository this should be relatively safe.
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

export async function htmlToPdf(url: string, pdfPath: string, browser: puppeteer.Browser | null = null) {
  const browserInstance = browser || await newBrowser();

  try {
    const page = await browserInstance.newPage();
    const margin = 30;

    await page.goto(url, { waitUntil: ["load", "domcontentloaded"] });
    await page.pdf({
      path: pdfPath,
      margin: { top: margin, bottom: margin, left: margin, right: margin },
    });
  } finally {
    if (browser === null) {
      await browserInstance.close();
    }
  }
}

export async function htmlToImage(
  url: string,
  imagePath: string,
  viewport: puppeteer.Viewport = RESOLUTION.HD,
  prefersColorScheme: ColorScheme = `light`,
  browser: puppeteer.Browser | null = null,
) {
  const browserInstance = browser || await newBrowser();

  try {
    const page = await browserInstance.newPage();

    await page.setViewport(viewport);
    await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: prefersColorScheme }]);
    await page.goto(url, { waitUntil: ["load", "domcontentloaded"] });
    await scrollToBottom(page);
    await page.screenshot({
      type: `png`,
      path: imagePath,
      fullPage: true,
    });
  } finally {
    if (browser === null) {
      await browserInstance.close();
    }
  }
}
