import { ProjectMedia } from '../types';

/**
 * Genuine screenshots only. A project without an entry here is presented as
 * text; nothing is mocked up.
 *
 * To add one: save the capture under public/images/projects/<project-id>/
 * and list it here with its real pixel dimensions. The first item is the
 * cover used on the home page.
 */
export const projectMedia: Record<string, ProjectMedia[]> = {
  'coach-prospers-world': [
    {
      src: '/images/projects/coach-prospers-world.png',
      alt: 'Home page of the Coach Prosper’s World production website',
      width: 1280,
      height: 800,
      caption: 'Public site, live at coachprospersworld.org',
    },
  ],
  cfss: [
    {
      src: '/images/projects/cfss/gis-field-map.jpg',
      alt: 'CFSS fieldwork workspace showing a traced community boundary and road on a satellite map',
      width: 1600,
      height: 900,
      caption: 'Fieldwork workspace: community boundary and road traced on the GIS map',
    },
    {
      src: '/images/projects/cfss/admin-dashboard.jpg',
      alt: 'CFSS institutional administration dashboard with registration and survey submission metrics',
      width: 1600,
      height: 900,
      caption: 'Administration dashboard: registration intake and survey submissions',
    },
  ],
  'mabia-ai': [
    {
      src: '/images/projects/mabia-ai/login.png',
      alt: 'Sign-in screen of the MABIA AI Care Network CHPS worker system',
      width: 1280,
      height: 800,
      caption: 'Sign-in screen of the deployed application',
    },
  ],
  'mastery-os': [
    {
      src: '/images/projects/mastery-os/learning-engine.png',
      alt: 'MasteryOS active retrieval session and prerequisite dependency graph',
      width: 1280,
      height: 800,
      caption: 'Active retrieval session and DAG prerequisite graph',
    },
  ],
};

export function getProjectCover(projectId: string): ProjectMedia | undefined {
  return projectMedia[projectId]?.[0];
}

export interface ProjectLive {
  /** Public deployment shown in the embedded preview. */
  url: string;
  /**
   * Whether the deployment permits being framed. Set from its response
   * headers (no X-Frame-Options, no CSP frame-ancestors restriction). If a
   * site later starts refusing frames, set this to false and the project
   * falls back to its screenshot plus a link.
   */
  embeddable: boolean;
  /** When the headers were last checked. */
  checked: string;
}

/**
 * Live embedded previews. Only projects with a working public deployment
 * belong here; a screenshot is never presented as live.
 */
export const projectLive: Record<string, ProjectLive> = {
  'coach-prospers-world': {
    url: 'https://coachprospersworld.org',
    embeddable: true,
    checked: '2026-11-10',
  },
};
