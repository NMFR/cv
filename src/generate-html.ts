import { cv } from "./cv.ts";
import { render } from "./render/html/html.ts";

const html = await render(cv);

Deno.writeTextFile(`cv.html`, html);
