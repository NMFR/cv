import {
  CV,
  Basics,
  Work,
  Education,
  Project,
  Certificate,
  Publication,
  Skill,
  Language,
  Interest,
  Reference,
  SocialNetworkProfile,
} from "../../model";
import { formatCountry, formatDate, formatURL, nonEmptyTaggedTemplate } from "../common";

/** Alias for `nonEmptyTaggedTemplate`. */
const ne = nonEmptyTaggedTemplate;

interface Link {
  name: string;
  url?: string;
}

async function file(path: string) {
  return "";
}

function escape(text: string | null | undefined) {
  if (!text) {
    return text;
  }

  return text;
}

// function escapeAttributeValue(value: string) {
//   return value
//     .replaceAll("<", "&lt;")
//     .replaceAll("&", "&amp;")
//     .replaceAll('"', "&quot");
// }

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

// icons from `feather-icons`
async function renderIcon(icon: `github` | `link` | `linkedin` | `mail` | `map-pin` | `phone`) {
  return file(`./icons/${icon}.svg`);
}

function renderLink(link: Link) {
  if (!link.url) {
    return escape(link.name);
  }

  return `<a href="${link.url}">${escape(link.name)}</a>`;
}

function renderHeader(basics: Basics) {
  return `
<header class="masthead">
  ${ne`<img src="${basics.image}" alt="">`}
  <div>
    <h1>${escape(basics.name)}</h1>
    <h2>${escape(basics.label)}</h2>
  </div>
  <article>
    ${escape(basics.summary) /* markdown */}
  </article>
  <ul class="icon-list">
    ${ne`
    <li>
      ${renderIcon(`map-pin`)}
      ${ne`${basics?.location?.city}, `}${escape(formatCountry(basics.location))}
    </li>
    `}
    <li>
      ${renderIcon(`mail`)}
      <a href="mailto:${basics.email}">${basics.email}</a>
    </li>
    ${ne`
    <li>
      ${renderIcon(`link`)}
      <a href="${basics.url}">${escape(formatURL(basics.url))}</a>
    </li>
    `}
    ${(basics.profiles ?? [])
      .map(
        (profile) => `
    <li>
      ${renderIcon(profile.network)}
      <a href="${profile.url}">${escape(profile.username)}</a>
      <span class="network">(${profile.network})</span>
    </li>`
      )
      .join(`\n`)}
  </ul>
</header>`;
}

function renderWork(works: Work[]) {
  if (works.length === 0) {
    return ``;
  }

  return `
<section id="work">
  <h3>Work</h3>
  <div class="stack">
    ${works
      .map(
        (w) => `
    <article>
      <header>
        ${ne`<h4>${escape(w.position)}</h4>`}}
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
      ${ne`${escape(w.summary) /* markdown */}`}
      ${
        (w.highlights ?? []).length
          ? `
      <ul>
        ${(w.highlights ?? [])
          .map(
            (highlight) => `
        <li>${escape(highlight) /* markdown */}}}</li>`
          )
          .join(`\n`)}
      </ul>`
          : ``
      }
    </article>`
      )
      .join(`\n`)}
  </div>
</section>`;
}

function renderEducation(education: Education[]) {
  if (education.length === 0) {
    return ``;
  }

  return `
<section id="education">
  <h3>Education</h3>
  <div class="stack">
    ${(education ?? [])
      .map(
        (e) => `
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
      ${ne`${escape(e.studyType) /* markdown */}`}
      ${
        (e.courses ?? []).length
          ? `
      <h5>Courses</h5>
      <ul>
        ${(e.courses ?? []).map((c) => `<li>${escape(c) /* markdown */}</li>`).join(`\n`)}
      </ul>`
          : ``
      }
    </article>`
      )
      .join(`\n`)}
  </div>
</section>`;
}

function renderProjects(projects: Project[]) {
  if (projects.length === 0) {
    return ``;
  }

  return `
<section id="projects">
  <h3>Projects</h3>
  <div class="stack">
    ${(projects ?? [])
      .map(
        (p) => `
    <article>
      <header>
        <h4>${renderLink(p)}</h4>
        <div class="meta">
          <div>
            ${(p.roles ?? []).join(` and `)}
            ${ne`at <strong>${p.entity}</strong>`}
          </div>
          <div>
            <time datetime="${p.startDate.toISOString()}">${formatDate(p.startDate)}</time> –
            ${p.endDate ? `<time datetime="${p.endDate.toISOString()}">${formatDate(p.endDate)}</time>` : `Present`}
          </div>
        </div>
      </header>
      ${ne`${escape(p.description) /* markdown */}`}
      ${
        (p.highlights ?? []).length
          ? `
      <ul>
        ${p.highlights?.map((h) => `<li>${escape(h) /* markdown */}</li>`).join(`\n`)}
      </ul>`
          : ``
      }
    </article>`
      )
      .join(`\n`)}
  </div>
</section>`;
}

function renderCertificates(certificates: Certificate[]) {
  if (certificates.length === 0) {
    return ``;
  }

  return `
<section id="certificates">
  <h3>Certificates</h3>
  <div class="stack">
    ${certificates
      .map(
        (c) => `
    <article>
      <header>
        <h4>${renderLink(c)}</h4>
        <div class="meta">
          ${ne`
          <div>
            Issued by <strong>${c.issuer}</strong>
          </div>
          `}
          ${ne`<time datetime="${c.date?.toISOString()}">${formatDate(c.date)}</time>`}
        </div>
      </header>
    </article>`
      )
      .join(`\n`)}
  </div>
</section>`;
}

function renderPublications(publications: Publication[]) {
  if (publications.length === 0) {
    return ``;
  }

  return `
<section id="publications">
  <h3>Publications</h3>
  <div class="stack">
    ${publications
      .map(
        (p) => `
    <article>
      <header>
        <h4>${renderLink(p)}}</h4>
        <div class="meta">
          ${ne`
          <div>
            Published by <strong>${escape(p.publisher)}</strong>
          </div>
          `}
          ${ne`<time datetime="${p.releaseDate?.toISOString()}">${formatDate(p.releaseDate)}}</time>`}
        </div>
      </header>
      ${ne`${escape(p.summary) /* markdown */}`}
    </article>`
      )
      .join(`\n`)}
  </div>
</section>`;
}

function renderSkills(skills: Skill[]) {
  if (skills.length === 0) {
    return ``;
  }

  return `
<section id="skills">
  <h3>Skills</h3>
  <div class="grid-list">
    ${skills
      .map(
        (s) => `
    <div>
      <h4>${escape(s.name)}</h4>
      ${
        (s.keywords ?? []).length
          ? `
      <ul class="tag-list">
        ${s.keywords?.map((k) => `<li>${escape(k)}</li>`).join(`\n`)}
      </ul>`
          : ``
      }
    </div>`
      )
      .join(`\n`)}
  </div>
</section>`;
}

function renderLanguages(languages: Language[]) {
  if (languages.length === 0) {
    return ``;
  }

  return `
<section id="languages">
  <h3>Languages</h3>
  <div class="grid-list">
    ${languages
      .map(
        (l) => `
    <div>
      ${ne`<h4>${escape(l.language)}</h4>`}
      ${ne`${escape(l.fluency)}`}
    </div>`
      )
      .join(`\n`)}
  </div>
</section>`;
}

function renderInterests(interests: Interest[]) {
  if (interests.length === 0) {
    return ``;
  }

  return `
<section id="interests">
  <h3>Interests</h3>
  <div class="grid-list">
    ${interests
      .map(
        (i) => `
    <div>
      ${ne`<h4>${escape(i.name)}</h4>`}
      ${
        (i.keywords ?? []).length
          ? `
      <ul class="tag-list">
        ${i.keywords?.map((k) => `<li>${escape(k)}</li>`).join(`\n`)}
      </ul>`
          : ``
      }
    </div>`
      )
      .join(`\n`)}
  </div>
</section>`;
}

function renderReferences(references: Reference[]) {
  if (references.length === 0) {
    return ``;
  }

  return `
<section id="references">
  <h3>References</h3>
  <div class="stack">
    ${references
      .map(
        (r) => `
    <blockquote>
      ${escape(r.reference) /* markdown */}
      <p>
        <cite>${escape(r.name)}</cite>
      </p>
    </blockquote>`
      )
      .join(`\n`)}
  </div>
</section>`;
}

export async function render(cv: CV) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${escape(cv.basics.name)}</title>
    <meta name="description" content="${escape(cv.basics.summary) /* markdown */}">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap">
    <style>${await file(`./style.css`)}</style>${
    `` /*
    <style>${await file(`./print.css`)}</style>
*/
  }
  </head>
  <body>
    ${renderHeader(cv.basics)}
    ${renderWork(cv.work ?? [])}
    ${renderEducation(cv.education ?? [])}
    ${renderProjects(cv.projects ?? [])}
    ${renderCertificates(cv.certificates ?? [])}
    ${renderPublications(cv.publications ?? [])}
    ${renderSkills(cv.skills ?? [])}
    ${renderLanguages(cv.languages ?? [])}
    ${renderInterests(cv.interests ?? [])}
    ${renderReferences(cv.references ?? [])}
  </body>
</html>`;
}
