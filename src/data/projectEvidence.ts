import { ProjectEvidence } from '../types';

/**
 * Evidence pages for team projects, keyed by project id.
 *
 * Nothing here is inferred. The role, team, stack and capabilities are taken
 * from the project's README; individual contributions are stated only at the
 * level the README documents them.
 */
export const projectEvidence: Record<string, ProjectEvidence> = {
  'mabia-ai': {
    organization: 'UNICEF StartUp Lab',
    programme: 'AI for Nurturing Care Hackathon 2026',
    tagline: 'CHPS Emergency Response, Voice Outreach and Nutrition Coordination Platform',
    overview: [
      'MABIA AI is an offline-first voice outreach, maternal healthcare emergency response and nutrition coordination platform designed for community healthcare in Northern Ghana.',
      'It calls pregnant women and caregivers in their own language over plain GSM, triaging danger signs, measuring dietary diversity and dispatching community transport.',
    ],
    role: {
      title: 'Full-stack and design',
      scope: 'CHPS Progressive Web App and interface.',
    },
    teamCapabilities: [
      'Append-only event log with idempotent offline sync',
      'Rule-based risk engine with reason codes and a human in the loop',
      'Nutrition engine that is gap-first, seasonal and affordability-aware',
      'IVR keypad triage, with a route to a nurse at any point',
      'Inbound hotline with flash-to-callback and a nurse cascade',
      'Emergency validation, driver cascade and outcome logging',
      'CHO worklist, enrolment, visit recording and facility board',
      'Outreach scheduler for the day’s due calls',
    ],
    team: [
      {
        name: 'Joshua Akum Winyelsum',
        role: 'Full-stack and design: CHPS Progressive Web App and interface.',
        isSelf: true,
      },
      {
        name: 'Prince Nasamu Alhassan',
        role: 'Engineering and AI lead: backend, speech models, risk and nutrition engines.',
      },
      {
        name: 'Dawuda Mardia',
        role: 'Nutrition and community research: the local-food model.',
      },
    ],
    stack: [
      { layer: 'Frontend', items: ['React', 'Vite', 'Progressive Web App', 'IndexedDB'] },
      { layer: 'Backend', items: ['Python', 'FastAPI', 'SQLAlchemy'] },
      { layer: 'Database', items: ['SQLite', 'PostgreSQL'] },
      { layer: 'Communications', items: ['Africa’s Talking Voice', 'SMS', 'USSD'] },
      { layer: 'Deployment', items: ['Vercel', 'Render'] },
    ],
    source: {
      label: 'Project README on GitHub',
      url: 'https://github.com/NasamuAlhassan/Mabia-AI#readme',
    },
  },
};
