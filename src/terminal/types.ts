import React from 'react';
import { Project, Skill, ExperienceItem, ResearchArea, SocialLink } from '../types';
import { Theme, ThemePreference } from '../contexts/ThemeContext';

export type CommandCategory =
  | 'Filesystem'
  | 'Linux'
  | 'Recruiter'
  | 'Projects'
  | 'Navigation'
  | 'General'
  | 'Technical'
  | 'Theme'
  | 'Utility';

export interface TraceState {
  project: string;
  step: number;
  active: boolean;
}

export interface ChallengeState {
  answered: boolean;
  selected: string;
  correct: boolean;
}

export interface CommandContext {
  // Virtual filesystem session state
  cwd: string;
  setCwd: (newCwd: string) => void;

  // Recruiter interactive features
  tourStep: number;
  setTourStep: (step: number) => void;
  traceState: TraceState;
  setTraceState: (state: TraceState) => void;
  challengeProgress: Record<number, ChallengeState>;
  setChallengeAnswer: (challengeId: number, selected: string, correct: boolean) => void;

  // Global application context
  navigate: (path: string) => void;
  openExternal: (url: string) => void;
  theme: Theme;
  themePreference: ThemePreference;
  setThemePreference: (pref: ThemePreference) => void;
  toggleTheme: () => void;
  clearHistory: () => void;
  closeTerminal: () => void;
  commandHistory: string[];
  projects: Project[];
  skills: Skill[];
  experience: ExperienceItem[];
  researchAreas: ResearchArea[];
  socialLinks: SocialLink[];
  contactInfo: { email: string; phone: string };
  runCommand: (cmdString: string) => void;
}

export interface CommandResult {
  output?: React.ReactNode;
  error?: string;
  isClear?: boolean;
  isExit?: boolean;
}

export interface Command {
  name: string;
  aliases?: string[];
  category: CommandCategory;
  description: string;
  usage?: string;
  examples?: string[];
  execute: (args: string[], ctx: CommandContext) => CommandResult | Promise<CommandResult>;
  getSubcommands?: (args: string[], ctx: CommandContext) => string[];
}
