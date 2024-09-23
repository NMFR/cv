import { Location } from "../model.ts";

export function formatCountry(location: Location) {
  if (Intl?.DisplayNames) {
    return new Intl.DisplayNames([`en`], { type: `region` }).of(
      location.countryCode
    );
  }

  if (location.country) {
    return location.country;
  }

  return location.countryCode;
}

export function formatDate(date: Date) {
  return date.toLocaleDateString(`en`, {
    month: `short`,
    year: `numeric`,
    timeZone: `UTC`,
  });
}

export function formatPhone(phone: string) {
  return phone.replace(/[^\d|+]+/g, "");
}

export function formatURL(url: string) {
  return url.replace(/^(https?:|)\/\//, "").replace(/\/$/, "");
}

// import { icons } from 'feather-icons';
// import Handlebars from 'handlebars';
// import micromark from 'micromark';
// import striptags from 'striptags';
// Handlebars.registerHelper('icon', (name, fallback) => (icons[name.toLowerCase()] || icons[fallback.toLowerCase()]).toSvg({
//   width: 16,
//   height: 16
// }));
// <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-linkedin"></svg>
// Handlebars.registerHelper('join', arr => Intl.ListFormat ? new Intl.ListFormat('en').format(arr) : arr.join(', '));
// Handlebars.registerHelper('markdown', doc => micromark(doc));
// Handlebars.registerHelper('stripTags', html => striptags(html));
