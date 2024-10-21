// Model based out of the json-resume schema
// https://github.com/jsonresume/resume-schema/blob/50798e359292ad4448d95b3bb0de5f694d6bcc4b/schema.json

export type URL = string;

export type Location = {
  country?: string;
  countryCode: string;
  city?: string;
};

export type SocialNetworkProfile = {
  network: "github" | "linkedin";
  url: URL;
  username: string;
};

export type Basics = {
  name: string;
  label: string; // title
  image?: URL; // avatar
  email: string;
  url?: URL;
  summary: string;
  location?: Location;
  profiles?: SocialNetworkProfile[];
};

export type Work = {
  name: string;
  location?: string;
  description?: string;
  position?: string;
  url?: URL;
  startDate: Date;
  endDate?: Date;
  summary?: string;
  highlights?: string[];
};

export type Education = {
  institution: string;
  url?: URL;
  area?: string;
  studyType?: string;
  startDate: Date;
  endDate?: Date;
  score?: string;
  courses?: string[];
};

export type Certificate = {
  name: string;
  date?: Date;
  url?: URL;
  issuer?: string;
};

export type Publication = {
  name: string;
  publisher?: string;
  releaseDate?: Date;
  url?: URL;
  summary?: string;
};

export type Skill = {
  name: string;
  level?: string;
  keywords?: string[];
};

export type Language = {
  language: string;
  fluency?: "basic" | "beginner" | "intermediate" | "independent" | "proficient" | "fluent" | "native";
};

export type Interest = {
  name: string;
  keywords?: string[];
};

export type Reference = {
  name: string;
  reference: string;
};

export type Project = {
  name: string;
  description?: string;
  highlights?: string[];
  keywords?: string[];
  startDate: Date;
  endDate?: Date;
  url?: URL;
  roles?: string[];
  entity?: string;
  type?: "volunteering" | "presentation" | "talk" | "application" | "conference";
};

export type Meta = {
  canonical?: URL; // latest version of this document
  version?: string;
  lastModified?: Date;
};

export type CV = {
  basics: Basics;
  work?: Work[];
  education?: Education[];
  certificates?: Certificate[];
  publications?: Publication[];
  skills?: Skill[];
  languages?: Language[];
  interests?: Interest[];
  references?: Reference[];
  projects?: Project[];
  meta?: Meta;
};
