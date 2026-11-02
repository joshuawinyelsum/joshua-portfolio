import React from 'react';
import { Command } from '../types';
import { InfoHeader, StatusBadge } from '../components/TerminalUI';

export const utilityCommands: Command[] = [
  {
    name: 'banner',
    aliases: ['logo', 'art'],
    category: 'Utility',
    description: 'Display personal engineering banner.',
    execute: () => ({
      output: (
        <pre className="font-mono text-[11px] leading-tight text-[#82AAFF] select-none overflow-x-auto">
{`   ██╗ ██████╗ ███████╗██╗  ██╗██╗   ██╗ █████╗
   ██║██╔═══██╗██╔════╝██║  ██║██║   ██║██╔══██╗
   ██║██║   ██║███████╗███████║██║   ██║███████║
██   ██║██║   ██║╚════██║██╔══██║██║   ██║██╔══██║
╚█████╔╝╚██████╔╝███████║██║  ██║╚██████╔╝██║  ██║
 ╚════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝
   SOFTWARE & SYSTEMS ENGINEER · PORTFOLIO TERMINAL`}
        </pre>
      ),
    }),
  },
  {
    name: 'motd',
    aliases: ['tip', 'welcome'],
    category: 'Utility',
    description: 'Display message of the day and developer guidance.',
    execute: () => {
      const messages = [
        "Welcome to the Joshua Winyelsum Engineering Command Center. Type 'projects' to review verified systems or 'theme dark' to switch appearance.",
        "Architecture philosophy: 'Build for reality. Real systems have intermittent networks, messy inputs, and finite resources.'",
        "Looking for case studies? Run 'open cfss', 'open cpw', 'open mastery', or 'open agrichem'.",
        "Tip: Use Tab autocomplete to complete any command name or subcommand.",
        "Every project claim on this portfolio is backed by actual code, automated tests, or staging evidence.",
      ];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      return {
        output: (
          <div className="space-y-1 font-mono text-xs">
            <InfoHeader title="MESSAGE OF THE DAY" />
            <p className="text-[#F0EEE7] leading-relaxed italic">
              "{randomMsg}"
            </p>
          </div>
        ),
      };
    },
  },
  {
    name: 'version',
    aliases: ['ver', 'build'],
    category: 'Utility',
    description: 'Display portfolio and terminal release version.',
    execute: () => ({
      output: (
        <div className="font-mono text-xs space-y-1 text-[#F0EEE7]">
          <InfoHeader title="SYSTEM VERSION" />
          <div>Portfolio Engine: <span className="text-[#82AAFF] font-bold">v2.4.0</span> (Architecture Edition)</div>
          <div className="text-[#A6A397]">Framework: React 18 · Vite 6 · Tailwind CSS 3</div>
          <div className="text-[#A6A397]">Terminal Scope: Independent Dark Console (#20211F)</div>
          <div className="text-[#A6A397]">Routing: React Router v6 (SPA with zero-FOUC state)</div>
          <div className="text-[#A6A397]">Terminal Registry: 20 native commands with fuzzy autocomplete</div>
          <div className="text-[#A6A397]">Host: Vercel Edge Network</div>
        </div>
      ),
    }),
  },
  {
    name: 'status',
    aliases: ['diag', 'info'],
    category: 'Utility',
    description: "Display portfolio's verified project statuses and system health.",
    execute: (_args, ctx) => ({
      output: (
        <div className="space-y-3 font-mono text-xs">
          <InfoHeader title="PORTFOLIO SYSTEM STATUS & TAXONOMY" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="p-2.5 rounded bg-[#292A27] border border-[#45453F] space-y-1">
              <span className="text-[10px] font-bold text-[#A6A397] uppercase tracking-widest block">Status Taxonomy</span>
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center gap-2"><StatusBadge status="LIVE" /> <span className="text-[#A6A397]">Public accessible deployment verified</span></div>
                <div className="flex items-center gap-2"><StatusBadge status="BUILT" /> <span className="text-[#A6A397]">Implementation complete with test suite</span></div>
                <div className="flex items-center gap-2"><StatusBadge status="IN PROGRESS" /> <span className="text-[#A6A397]">Active development</span></div>
                <div className="flex items-center gap-2"><StatusBadge status="RESEARCH" /> <span className="text-[#A6A397]">Evidence register & dataset analysis</span></div>
                <div className="flex items-center gap-2"><StatusBadge status="PLANNED" /> <span className="text-[#A6A397]">Conceptual exploration</span></div>
              </div>
            </div>
            <div className="p-2.5 rounded bg-[#292A27] border border-[#45453F] space-y-1">
              <span className="text-[10px] font-bold text-[#A6A397] uppercase tracking-widest block">Environment Metrics</span>
              <div className="space-y-1 text-[11px] text-[#F0EEE7]">
                <div>Website Theme: <span className="font-bold uppercase text-[#82AAFF]">{ctx.theme}</span> ({ctx.themePreference})</div>
                <div>Terminal Design: <span className="font-bold text-[#7EC28D]">Permanently Dark (#20211F)</span></div>
                <div>Verified Projects: <span className="font-bold">{ctx.projects.length} featured</span></div>
                <div>Automated Tests: <span className="font-bold text-[#7EC28D]">Passing (Vitest, Pytest, Playwright)</span></div>
                <div>Integrity: <span className="font-bold text-[#7EC28D]">Verified Evidence-Backed</span></div>
              </div>
            </div>
          </div>
        </div>
      ),
    }),
  },
];
