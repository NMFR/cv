import {
  Basics,
  Certificate,
  CV,
  Education,
  Interest,
  Language,
  Project,
  Publication,
  Reference,
  Skill,
  Work,
} from "../../model.ts";
import { formatCountry, formatDate, formatURL } from "../format.ts";
import { ensureNoDefaultToString, nonEmptyTaggedTemplate as ne, taggedTemplate as t } from "../string.ts";

const htmlEscapeMap = {
  "<": `&lt;`,
  ">": `&gt;`,
  "&": `&amp;`,
};

function escape(text: string | null | undefined) {
  if (!text) {
    return text;
  }

  return Object.entries(htmlEscapeMap).reduce(
    (text, [pattern, replacement]) => text.replaceAll(pattern, replacement),
    text,
  );
}

const htmlAttributeEscapeMap = {
  ...htmlEscapeMap,
  '"': `&quot;`,
  "\"'": `&#39;`,
};

function escapeAttr(text: string | null | undefined) {
  if (!text) {
    return text;
  }

  return Object.entries(htmlAttributeEscapeMap).reduce(
    (text, [pattern, replacement]) => text.replaceAll(pattern, replacement),
    text,
  );
}

function markdownLite(text: string | null | undefined) {
  if (!text) {
    return text;
  }

  const paragraphs = text.split("\n\n");

  return paragraphs.map((p) => `<p>${p}</p>`).join(`\n`);
}

function file(path: string) {
  return Deno.readTextFile(`./src/render/html/${path}`);
}

// icons from `feather-icons`
function renderIcon(
  icon: `github` | `link` | `linkedin` | `mail` | `map-pin` | `phone`,
) {
  return file(`./icons/${icon}.svg`);
}

interface Link {
  name: string;
  url?: string;
}

function renderLink(link: Link) {
  if (!link.url) {
    return escape(link.name);
  }

  return `<a href="${escapeAttr(link.url)}">${escape(link.name)}</a>`;
}

function renderHeader(basics: Basics) {
  return t`
<header class="masthead">
  ${ne`<img src="${escapeAttr(basics.image)}" alt="">`}
  <div>
    <h1>${escape(basics.name)}</h1>
    <h2>${escape(basics.label)}</h2></div>
  <article>
    ${markdownLite(escape(basics.summary))}
  </article>
  <ul class="icon-list">
    ${ne`
    <li>
      ${renderIcon(`map-pin`)}
      ${ne`${escape(basics?.location?.city)}, `}${escape(formatCountry(basics.location))}
    </li>
    `}
    <li>
      ${renderIcon(`mail`)}
      <a href="mailto:${escapeAttr(basics.email)}">${escape(basics.email)}</a>
    </li>
    ${ne`
    <li>
      ${renderIcon(`link`)}
      <a href="${escapeAttr(basics.url)}">${escape(formatURL(basics.url))}</a>
    </li>
    `}
    ${ne`${
    basics.profiles?.map((profile) =>
      t`
    <li>
      ${renderIcon(profile.network)}
      <a href="${escapeAttr(profile.url)}">${escape(profile.username)}</a>
      <span class="network">(${escape(profile.network)})</span>
    </li>`
    )
  }`}
  </ul>
</header>`;
}

function renderWork(works?: Work[]) {
  return ne`
<section id="work">
  <h3>Work</h3>
  <div class="stack">
    ${
    works?.map((w) =>
      t`
    <article>
      <header>
        ${ne`<h4>${escape(w.position)}</h4>`}
        <div class="meta">
          <div>
            <strong>${renderLink(w)}</strong>
            ${ne`<span class="bullet-item">${escape(w.description)}</span>`}
          </div>
          <div>
            <time datetime="${w.startDate.toISOString()}">${formatDate(w.startDate)}</time> –
            ${w.endDate ? `<time datetime="${w.endDate.toISOString()}">${formatDate(w.endDate)}</time>` : `Present`}
          </div>
          ${ne`<div>${escape(w.location)}</div>`}
        </div>
      </header>
      ${ne`${markdownLite(escape(w.summary))}`}
      ${ne`
      <ul>
      ${
        w.highlights?.map((highlight) => `
        <li>${markdownLite(escape(highlight))}</li>`)
      }
      </ul>`}
    </article>`
    )
  }
  </div>
</section>`;
}

function renderEducation(education?: Education[]) {
  return ne`
<section id="education">
  <h3>Education</h3>
  <div class="stack">
    ${
    education?.map((e) =>
      t`
    <article>
      <header>
        <h4>${renderLink({ name: e.institution, url: e.url })}</h4>
        <div class="meta">
          ${ne`<strong>${escape(e.area)}</strong>`}
          <div>
            <time datetime="${e.startDate.toISOString()}">${formatDate(e.startDate)}</time> –
            ${e.endDate ? `<time datetime="${e.endDate.toISOString()}">${formatDate(e.endDate)}</time>` : `Present`}
          </div>
        </div>
      </header>
      ${ne`${markdownLite(escape(e.studyType))}`}
      ${ne`
      <h5>Courses</h5>
      <ul>
        ${e.courses?.map((c) => `<li>${markdownLite(escape(c))}</li>`)}
      </ul>`}
    </article>`
    )
  }
  </div>
</section>`;
}

function renderProjects(projects?: Project[]) {
  return ne`
<section id="projects">
  <h3>Projects</h3>
  <div class="stack">
    ${
    projects?.map((p) =>
      t`
    <article>
      <header>
        <h4>${renderLink(p)}</h4>
        <div class="meta">
          <div>
            ${escape((p.roles ?? []).join(` and `))}
            ${ne`at <strong>${escape(p.entity)}</strong>`}
          </div>
          <div>
            <time datetime="${p.startDate.toISOString()}">${formatDate(p.startDate)}</time> –
            ${p.endDate ? `<time datetime="${p.endDate.toISOString()}">${formatDate(p.endDate)}</time>` : `Present`}
          </div>
        </div>
      </header>
      ${ne`${markdownLite(escape(p.description))}`}
      ${ne`
      <ul>
        ${p.highlights?.map((h) => `<li>${markdownLite(escape(h))}</li>`)}
      </ul>`}
    </article>`
    )
  }
  </div>
</section>`;
}

function renderCertificates(certificates?: Certificate[]) {
  return ne`
<section id="certificates">
  <h3>Certificates</h3>
  <div class="stack">
    ${
    certificates?.map(
      (c) => `
    <article>
      <header>
        <h4>${renderLink(c)}</h4>
        <div class="meta">
          ${ne`
          <div>
            Issued by <strong>${escape(c.issuer)}</strong>
          </div>
          `}
          ${ne`<time datetime="${c.date?.toISOString()}">${formatDate(c.date)}</time>`}
        </div>
      </header>
    </article>`,
    )
  }
  </div>
</section>`;
}

function renderPublications(publications?: Publication[]) {
  return ne`
<section id="publications">
  <h3>Publications</h3>
  <div class="stack">
    ${
    publications?.map(
      (p) => `
    <article>
      <header>
        <h4>${renderLink(p)}</h4>
        <div class="meta">
          ${ne`
          <div>
            Published by <strong>${escape(p.publisher)}</strong>
          </div>
          `}
          ${ne`<time datetime="${p.releaseDate?.toISOString()}">${formatDate(p.releaseDate)}}</time>`}
        </div>
      </header>
      ${ne`${markdownLite(escape(p.summary))}`}
    </article>`,
    )
  }
  </div>
</section>`;
}

function renderSkills(skills?: Skill[]) {
  return ne`
<section id="skills">
  <h3>Skills</h3>
  <div class="grid-list">
    ${
    skills?.map(
      (s) =>
        t`
    <div>
      <h4>${escape(s.name)}</h4>
      ${ne`
      <ul class="tag-list">
        ${s.keywords?.map((k) => `<li>${escape(k)}</li>`)}
      </ul>`}
    </div>`,
    )
  }
  </div>
</section>`;
}

function renderLanguages(languages?: Language[]) {
  return ne`
<section id="languages">
  <h3>Languages</h3>
  <div class="grid-list">
    ${
    languages?.map(
      (l) => `
    <div>
      ${ne`<h4>${escape(l.language)}</h4>`}
      ${ne`${escape(l.fluency)}`}
    </div>`,
    )
  }
  </div>
</section>`;
}

function renderInterests(interests?: Interest[]) {
  return ne`
<section id="interests">
  <h3>Interests</h3>
  <div class="grid-list">
    ${
    interests?.map(
      (i) =>
        t`
    <div>
      ${ne`<h4>${escape(i.name)}</h4>`}
      ${ne`
      <ul class="tag-list">
        ${i.keywords?.map((k) => `<li>${escape(k)}</li>`)}
      </ul>`}
    </div>`,
    )
  }
  </div>
</section>`;
}

function renderReferences(references?: Reference[]) {
  return ne`
<section id="references">
  <h3>References</h3>
  <div class="stack">
    ${
    references?.map(
      (r) => `
    <blockquote>
      ${markdownLite(escape(r.reference))}
      <p>
        <cite>${escape(r.name)}</cite>
      </p>
    </blockquote>`,
    )
  }
  </div>
</section>`;
}

export async function render(cv: CV) {
  const template = t`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${escape(cv.basics.name)}'s curriculum vitae</title>
    <meta name="description" content="${markdownLite(escape(cv.basics.summary))}">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap">
    <style>${file(`./css/style.css`)}</style>${``
    /*
    <style>${file(`./css/print.css`)}</style>
    */
  }
  </head>
  <body>
    ${renderHeader(cv.basics)}
    ${renderWork(cv.work)}
    ${renderEducation(cv.education)}
    ${renderProjects(cv.projects)}
    ${renderCertificates(cv.certificates)}
    ${renderPublications(cv.publications)}
    ${renderSkills(cv.skills)}
    ${renderLanguages(cv.languages)}
    ${renderInterests(cv.interests)}
    ${renderReferences(cv.references)}
  </body>
</html>`;

  const result = await template.getString();

  ensureNoDefaultToString(result);

  return result;
}
