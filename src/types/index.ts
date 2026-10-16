export interface Project {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  problem?: string;
  system?: string;
  technologies: string[];
  capabilities?: string[];
  scaleStatement?: string;
  cta: string;
  ctaLink: string;
  status?: 'shipped' | 'building' | 'research';
  featured: boolean;
  liveUrl?: string;
  isPrivateRepo?: boolean;
}

export interface Skill {
  name: string;
  category: string;
  linkedProjects: string[]; // project ids
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
  detail?: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  description: string;
  technologies: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  location: string;
  status: string;
  coursework?: string[];
}

export interface Credential {
  issuer: string;
  title: string;
  score?: string;
  type: string;
  year?: string;
}

export interface SocialLink {
  platform: string;
  handle: string;
  url: string;
}

export interface BuildingProject {
  title: string;
  subtitle: string;
  description: string;
  status: string;
}

export interface ResearchArea {
  title: string;
  description: string;
}

export interface ResearchSource {
  name: string;
  abbreviation?: string;
}
