import { Location } from "../model.ts";

export function formatCountry(location: Location | null | undefined) {
  if (!location) {
    return location;
  }

  if (Intl?.DisplayNames) {
    const country = new Intl.DisplayNames([`en`], { type: `region` }).of(location.countryCode);

    if (country) {
      return country;
    }
  }

  return location.country ? location.country : location.countryCode;
}

function isValid(date: Date) {
  return !isNaN(date.getTime());
}

export function formatDate(date: Date | null | undefined) {
  if (!date) {
    return date;
  }

  if (!isValid(date)) {
    return undefined;
  }

  return date.toLocaleDateString(`en`, {
    month: `short`,
    year: `numeric`,
    timeZone: `UTC`,
  });
}

export function formatPhone(phone: string | null | undefined) {
  if (!phone) {
    return phone;
  }

  return phone.replace(/[^\d|+]+/g, "");
}

export function formatURL(url: string | null | undefined) {
  if (!url) {
    return url;
  }

  return url.replace(/^(https?:|)\/\//, "").replace(/\/$/, "");
}
