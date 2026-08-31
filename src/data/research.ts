import { ResearchArea, ResearchSource } from '../types';

export const researchAreas: ResearchArea[] = [
  {
    title: 'Dataset Discovery',
    description: 'Finding what datasets actually exist.',
  },
  {
    title: 'Schema Analysis',
    description: 'Understanding how different sources represent similar information.',
  },
  {
    title: 'Data Quality',
    description: 'Identifying missing, inconsistent, duplicated, or unreliable information.',
  },
  {
    title: 'Canonicalization',
    description: 'Creating consistent structures across fragmented datasets.',
  },
  {
    title: 'Pipeline Gaps',
    description: 'Understanding where information breaks down between collection, storage, processing, and use.',
  },
];

export const researchSources: ResearchSource[] = [
  { name: 'Environmental Protection Agency', abbreviation: 'EPA Ghana' },
  { name: 'Plant Protection and Regulatory Services Directorate', abbreviation: 'PPRSD' },
  { name: 'Ministry of Food and Agriculture', abbreviation: 'MoFA' },
  { name: 'Ghana Cocoa Board', abbreviation: 'COCOBOD' },
  { name: 'Cocoa Research Institute of Ghana', abbreviation: 'CRIG' },
  { name: 'Food and Drugs Authority', abbreviation: 'FDA Ghana' },
  { name: 'Ghana Statistical Service', abbreviation: 'GSS' },
  { name: 'Ghana Revenue Authority / ICUMS', abbreviation: 'GRA / ICUMS' },
  { name: 'Ghana Standards Authority', abbreviation: 'GSA' },
];
