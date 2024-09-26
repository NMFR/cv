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

function renderProjects(cv: Project[]) {
  return `{{#if resume.projects.length}}
      <section id="projects">
        <h3>Projects</h3>
        <div class="stack">
          {{#each resume.projects}}
            <article>
              <header>
                <h4>{{> link}}</h4>
                <div class="meta">
                  <div>
                    {{#if roles}}
                      <strong>{{join roles}}</strong>
                    {{/if}}
                    {{#entity}}
                      at <strong>{{.}}</strong>
                    {{/entity}}
                  </div>
                  <div>
                    <time datetime="{{startDate}}">{{formatDate startDate}}</time> –
                    {{#if endDate}}<time datetime="{{endDate}}">{{formatDate endDate}}</time>{{else}}Present{{/if}}
                  </div>
                </div>
              </header>
              {{#description}}
                {{{markdown .}}}
              {{/description}}
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
    {{/if}}`;
}

function renderCertificates(cv: Certificate[]) {
  return `{{#if resume.certificates.length}}
      <section id="certificates">
        <h3>Certificates</h3>
        <div class="stack">
          {{#each resume.certificates}}
            <article>
              <header>
                <h4>{{> link}}</h4>
                <div class="meta">
                  {{#issuer}}
                    <div>
                      Issued by <strong>{{.}}</strong>
                    </div>
                  {{/issuer}}
                  {{#date}}
                    <time datetime="{{.}}">{{formatDate .}}</time>
                  {{/date}}
                </div>
              </header>
            </article>
          {{/each}}
        </div>
      </section>
    {{/if}}`;
}

function renderPublications(cv: Publication[]) {
  return `{{#if resume.publications.length}}
    <section id="publications">
      <h3>Publications</h3>
      <div class="stack">
        {{#each resume.publications}}
          <article>
            <header>
              <h4>{{> link}}</h4>
              <div class="meta">
                {{#publisher}}
                  <div>
                    Published by <strong>{{.}}</strong>
                  </div>
                {{/publisher}}
                {{#releaseDate}}
                  <time datetime="{{.}}">{{formatDate .}}</time>
                {{/releaseDate}}
              </div>
            </header>
            {{#summary}}
              {{{markdown .}}}
            {{/summary}}
          </article>
        {{/each}}
      </div>
    </section>
  {{/if}}`;
}

function renderSkills(cv: Skill[]) {
  return `{{#if resume.skills.length}}
      <section id="skills">
        <h3>Skills</h3>
        <div class="grid-list">
          {{#each resume.skills}}
            <div>
              {{#name}}
                <h4>{{.}}</h4>
              {{/name}}
              {{#if keywords.length}}
                <ul class="tag-list">
                  {{#keywords}}
                    <li>{{.}}</li>
                  {{/keywords}}
                </ul>
              {{/if}}
            </div>
          {{/each}}
        </div>
      </section>
    {{/if}}`;
}

function renderLanguages(cv: Language[]) {
  return `{{#if resume.languages.length}}
      <section id="languages">
        <h3>Languages</h3>
        <div class="grid-list">
          {{#each resume.languages}}
            <div>
              {{#language}}
                <h4>{{.}}</h4>
              {{/language}}
              {{fluency}}
            </div>
          {{/each}}
        </div>
      </section>
    {{/if}}`;
}

function renderInterests(cv: Interest[]) {
  return `{{#if resume.interests.length}}
      <section id="interests">
        <h3>Interests</h3>
        <div class="grid-list">
          {{#each resume.interests}}
            <div>
              {{#name}}
                <h4>{{.}}</h4>
              {{/name}}
              {{#if keywords.length}}
                <ul class="tag-list">
                  {{#keywords}}
                    <li>{{.}}</li>
                  {{/keywords}}
                </ul>
              {{/if}}
            </div>
          {{/each}}
        </div>
      </section>
    {{/if}}`;
}

function renderReferences(cv: Reference[]) {
  return `{{#if resume.references.length}}
      <section id="references">
        <h3>References</h3>
        <div class="stack">
          {{#each resume.references}}
            {{#if reference}}
              <blockquote>
                {{{markdown reference}}}
                {{#name}}
                  <p>
                    <cite>{{.}}</cite>
                  </p>
                {{/name}}
              </blockquote>
            {{/if}}
          {{/each}}
        </div>
      </section>
    {{/if}}`;
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
    <style>${await file(`./style.css`)}</style>
    <style>${await file(`./print.css`)}</style>
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
