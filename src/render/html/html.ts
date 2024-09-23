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
} from "../../model";

async function file(path: string) {
  return "";
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

function renderMeta(cv: Basics) {
  return ``;
}

function renderHeader(cv: Basics) {
  return ``;
}

function renderWork(cv: Work[]) {
  return ``;
}

function renderEducation(cv: Education[]) {
  return ``;
}

function renderProjects(cv: Project[]) {
  return ``;
}

function renderCertificates(cv: Certificate[]) {
  return ``;
}

function renderPublications(cv: Publication[]) {
  return ``;
}

function renderSkills(cv: Skill[]) {
  return ``;
}

function renderLanguages(cv: Language[]) {
  return ``;
}

function renderInterests(cv: Interest[]) {
  return ``;
}

function renderReferences(cv: Reference[]) {
  return ``;
}

export async function render(cv: CV) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <!-- {{#resume.basics}} -->
      <!-- {{> meta}} -->
    ${renderMeta(cv.basics)}
    <!-- {{/resume.basics}} -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap">
    <!-- <style> {{{css}}}</style> -->
    <style>${await file(`./style.css`)}</style>
  </head>
  <body>
    <!-- {{#resume.basics}} -->
      <!-- {{> header}} -->
    ${renderHeader(cv.basics)}
    <!-- {{/resume.basics}} -->

    <!-- {{> work}} -->
    ${renderWork(cv.work ?? [])}
    <!-- {{> volunteer}} -->
    <!-- {{> education}} -->
    ${renderEducation(cv.education ?? [])}
    <!-- {{> projects}} -->
    ${renderProjects(cv.projects ?? [])}
    <!-- {{> awards}} -->
    <!-- {{> certificates}} -->
    ${renderCertificates(cv.certificates ?? [])}
    <!-- {{> publications}} -->
    ${renderPublications(cv.publications ?? [])}
    <!-- {{> skills}} -->
    ${renderSkills(cv.skills ?? [])}
    <!-- {{> languages}} -->
    ${renderLanguages(cv.languages ?? [])}
    <!-- {{> interests}} -->
    ${renderInterests(cv.interests ?? [])}
    <!-- {{> references}} -->
    ${renderReferences(cv.references ?? [])}
  </body>
</html>
`;
}
