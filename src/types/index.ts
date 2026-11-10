export type ProjectStatus = 'LIVE' | 'BUILT' | 'IN PROGRESS' | 'RESEARCH' | 'PLANNED';

export interface Project {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  /** One concise sentence for showcase cards. */
  summary: string;
  problem?: string;
  system?: string;
  technologies: string[];
  capabilities?: string[];
  scaleStatement?: string;
  cta: string;
  ctaLink: string;
  status: ProjectStatus;
  featured: boolean;
  liveUrl?: string;
  /** Public source repository. */
  repoUrl?: string;
  isPrivateRepo?: boolean;
  /**
   * False when there is no case-study page for the project; its action then
   * opens the deployed application instead.
   */
  hasCaseStudy?: boolean;
}

export interface ProjectMedia {
  /** Path under /public. Only genuine screenshots of the running product. */
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

/**
 * Evidence for a team project: every statement here comes from a named
 * source (the project README or the deployed application).
 */
export interface ProjectEvidence {
  organization: string;
  programme: string;
  /** The project's own one-line description. */
  tagline: string;
  overview: string[];
  /** The role as documented, kept apart from what the team built. */
  role: {
    title: string;
    scope: string;
  };
  /** Capabilities of the whole product, credited to the team. */
  teamCapabilities: string[];
  team: {
    name: string;
    role: string;
    isSelf?: boolean;
  }[];
  stack: {
    layer: string;
    items: string[];
  }[];
  /** Where the facts on the page come from. */
  source: {
    label: string;
    url: string;
  };
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
  /** Programme or event the role was part of. */
  programme?: string;
  /** The product worked on, linked to its real deployment. */
  project?: {
    name: string;
    url: string;
    /** In-site page presenting the evidence for this work. */
    evidencePath?: string;
  };
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
  /** Kind of credential, e.g. "Verified certification". */
  type: string;
  /** Result, e.g. "Passed". */
  status?: string;
  /** Grade or distinction, e.g. "94.52%". */
  score?: string;
  /** Human-readable achievement date. Only set when the date is known. */
  date?: string;
  /** Machine-readable form of `date` (YYYY-MM-DD). */
  dateISO?: string;
  year?: string;
  /** Scholarship or programme the credential was earned through. */
  program?: string;
  /** Credential identifier exactly as printed on the certificate. */
  credentialId?: string;
  /** Public verification page. Only ever a real issuer URL. */
  verifyUrl?: string;
  /** The actual certificate image, as supplied (under /public). */
  image?: ProjectMedia;
  /** The certificate PDF, as supplied: a /public path or the issuer's URL. */
  pdfUrl?: string;
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
  status: ProjectStatus;
}

export interface ResearchArea {
  title: string;
  description: string;
}

export interface ResearchSource {
  name: string;
  abbreviation?: string;
}
