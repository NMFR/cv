import { CV } from "../../model";

async function readFile(path: string) {
  return "";
}

function escapeAttributeValue(value: string) {
  return value
    .replaceAll("<", "&lt;")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot");
}

// function html(
//   strings: TemplateStringsArray,
//   ...expressions: unknown[]
// ): string {
//   let result = strings[0];

//   for (let i = 1, l = strings.length; i < l; i++) {
//     result += expressions[i - 1];
//     result += strings[i];
//   }

//   return result;
// }

// const html = String.raw;

export async function render(cv: CV) {
  return /* html */ `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${cv.basics.name}'s curriculum vitae</title>
    <meta name="description" content="${cv.basics.summary}">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap">
    <style>${await readFile(`./style.css`)}</style>
  </head>
  <body>
    <header class="masthead">
      ${cv.basics.image ? `<img src="${cv.basics.image}" alt="Avatar">` : ""}
    <div>
      <h1>${cv.basics.name}</h1>
      <h2>${cv.basics.label}</h2>
    </div>
    <article>
      ${cv.basics.summary /* markdown */}
    </article>
    <ul class="icon-list">
      ${
        cv.basics?.location?.country && cv.basics?.location.city
          ? `<li>
        {{{icon 'map-pin'}}}
        ${cv.basics.location.city}, ${
              cv.basics.location.country /*formatCountry*/
            }
      </li>`
          : ""
      }
      <li>
        {{{icon 'mail'}}}
        <a href="mailto:${cv.basics.email}">${cv.basics.email}</a>
      </li>
      ${
        cv.basics.url
          ? `<li>
        {{{icon 'link'}}}
        <a href="${cv.basics.url}">${cv.basics.url /* formatURL */}</a>
      </li>`
          : ""
      }
      ${(cv.basics.profiles || []).map(
        (p) => `<li>
        {{{icon network 'user'}}}
        <a href="${p.url}">${p.username}</a>
        <span class="network">(${p.network}})</span>
      </li>`
      )}
    </ul>
  </header>
    {{> work}}

    {{#if resume.work.length}}
  <section id="work">
    <h3>Work</h3>
    <div class="stack">
      {{#each resume.work}}
        <article>
          <header>
            <h4>{{position}}</h4>
            <div class="meta">
              <div>
                <strong>{{> link}}</strong>
                {{#description}}
                  <span class="bullet-item">{{.}}</span>
                {{/description}}
              </div>
              <div>
                <time datetime="{{startDate}}">{{formatDate startDate}}</time> –
                {{#if endDate}}<time datetime="{{endDate}}">{{formatDate endDate}}</time>{{else}}Present{{/if}}
              </div>
              {{#location}}
                <div>{{.}}</div>
              {{/location}}
            </div>
          </header>
          {{#summary}}
            {{{markdown .}}}
          {{/summary}}
          {{#if highlights.length}}
            <ul>
              {{#highlights}}
                <li>{{{markdown .}}}</li>
              {{/highlights}}
            </ul>
          {{/if}}
        </article>
      {{/each}}
    </div>
  </section>
{{/if}}


    ${"" /* volunteer */}}
    {{> education}}
    {{> projects}}
    {{> awards}}
    {{> certificates}}
    {{> publications}}
    {{> skills}}
    {{> languages}}
    {{> interests}}
    {{> references}}
  </body>
</html>
`;
}
