import { htmlToPdf } from "./puppeteer.ts";

async function main() {
  const htmlUrl = Deno.args[0];
  const pdfPath = Deno.args[1];

  if (!htmlUrl || !pdfPath) {
    console.error(`missing or invalid arguments.
Usage: deno run src/html-to-pdf.ts [HTML_URL] [PDF_PATH]`);

    return;
  }

  await htmlToPdf(htmlUrl, pdfPath);
}

await main();
