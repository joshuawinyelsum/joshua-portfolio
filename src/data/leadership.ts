export interface OrganizationIdentity {
  name: string;
  badge?: string;
  badgeTone?: 'lavender' | 'cream' | 'onyx';
  institution?: string;
  programme?: string;
  website?: string;
}

export interface LeadershipTeamMember {
  name: string;
  role: string;
  isSelf?: boolean;
}

export interface EvidenceLink {
  label: string;
  url: string;
  isExternal?: boolean;
}

export interface LeadershipEntryData {
  id: string;
  area: 'community' | 'campus' | 'collaboration';
  areaLabel: string;
  organization: OrganizationIdentity;
  role: string;
  appointmentStatus?: string;
  description: string;
  focusAreas?: string[];
  team?: LeadershipTeamMember[];
  links?: EvidenceLink[];
}

export interface CreativePracticeData {
  id: string;
  instrument: string;
  role: string;
  description: string;
  attributes: string[];
}

export const communityLeadership: LeadershipEntryData = {
  id: 'kelnode',
  area: 'community',
  areaLabel: 'Community Leadership & Peer Learning',
  organization: {
    name: 'Kelnode',
    badge: 'Co-Founding Initiative',
    badgeTone: 'cream',
  },
  role: 'Co-Founder & Mentor',
  description:
    'Co-founded Kelnode as a collaborative technology community and peer-learning initiative. Dedicated to engineering education, peer-to-peer technical mentorship, and creating an active environment where aspiring developers learn systems fundamentals and build software collaboratively.',
  focusAreas: [
    'Community Building',
    'Engineering Education',
    'Peer-to-Peer Learning',
    'Technical Mentorship',
    'Collaborative Software Development',
  ],
  links: [
    {
      label: 'Kelnode Platform Foundation',
      url: '#building',
      isExternal: false,
    },
  ],
};

export const campusLeadership: LeadershipEntryData = {
  id: 'wiwik-100',
  area: 'campus',
  areaLabel: 'Campus Leadership & Representation',
  organization: {
    name: 'WIWIK Foundation',
    programme: 'WIWIK 100',
    institution: 'University for Development Studies (UDS)',
    badge: 'Official Appointment',
    badgeTone: 'lavender',
  },
  role: 'Campus Ambassador',
  appointmentStatus: 'Officially Appointed',
  description:
    'Officially appointed as Campus Ambassador representing the WIWIK Foundation and its flagship WIWIK 100 programme at the University for Development Studies (UDS). Serving as an institutional ambassador connecting campus talent with leadership development, mentorship, and foundation initiatives.',
  focusAreas: [
    'Official Campus Representation',
    'Student Network Engagement',
    'Institutional Outreach',
    'Programme Coordination',
  ],
};

export const collaborativeEngineering: LeadershipEntryData = {
  id: 'mabia-ai',
  area: 'collaboration',
  areaLabel: 'Technology & Innovation Collaboration',
  organization: {
    name: 'UNICEF StartUp Lab',
    programme: 'AI for Nurturing Care Hackathon 2026',
    badge: 'Collaborative Innovation',
    badgeTone: 'onyx',
  },
  role: 'Full-Stack & Design',
  description:
    'Collaborated within a multidisciplinary engineering team to design and build the CHPS Progressive Web App and user interface for MABIA AI, an offline-first voice outreach, maternal emergency response, and nutrition coordination platform for community health centers in Northern Ghana.',
  team: [
    {
      name: 'Joshua Akum Winyelsum',
      role: 'Full-stack and design: CHPS Progressive Web App and interface',
      isSelf: true,
    },
    {
      name: 'Prince Nasamu Alhassan',
      role: 'Engineering & AI lead: backend, speech models, risk & nutrition engines',
    },
    {
      name: 'Dawuda Mardia',
      role: 'Nutrition & community research: local-food model',
    },
  ],
  links: [
    {
      label: 'View Project Evidence',
      url: '/case-study/mabia-ai',
      isExternal: false,
    },
    {
      label: 'GitHub Repository',
      url: 'https://github.com/NasamuAlhassan/Mabia-AI',
      isExternal: true,
    },
    {
      label: 'Live Application',
      url: 'https://mabia-ai.vercel.app/login',
      isExternal: true,
    },
  ],
};

export const creativePractices: CreativePracticeData[] = [
  {
    id: 'bass-guitar',
    instrument: 'Bass Guitar',
    role: 'Church Musician & Bass Guitar Player',
    description:
      'Providing the harmonic foundation, rhythmic pulse, and temporal lock within live church musical ensembles. Grounded in disciplined practice, acute listening, and real-time musical responsiveness.',
    attributes: [
      'Rhythm & Timing Precision',
      'Harmonic Foundation',
      'Live Ensemble Collaboration',
      'Continuous Practice Discipline',
    ],
  },
  {
    id: 'piano-keyboard',
    instrument: 'Piano / Keyboard',
    role: 'Church Musician & Keyboard Player',
    description:
      'Exploring melodic voicing, harmonic progressions, and dynamic accompaniment during live worship services. Balancing theoretical musical structure with collaborative sensitivity.',
    attributes: [
      'Harmonic Voicing & Theory',
      'Dynamic Accompaniment',
      'Musician Collaboration',
      'Rhythmic Discipline',
    ],
  },
];
