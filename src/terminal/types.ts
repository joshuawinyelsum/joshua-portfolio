import React from 'react';
import { Project, Skill, ExperienceItem, ResearchArea, SocialLink } from '../types';
import { Theme, ThemePreference } from '../contexts/ThemeContext';

export type CommandCategory = 'General' | 'Navigation' | 'Projects' | 'Technical' | 'Theme' | 'Utility';

export interface CommandContext {
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
