import React from 'react';
import { Command } from '../types';
import { InfoHeader, SuccessMsg } from '../components/TerminalUI';

export const navigationCommands: Command[] = [
  {
    name: 'home',
    aliases: ['index', 'top'],
    category: 'Navigation',
    description: 'Navigate to portfolio homepage top.',
    execute: (_args, ctx) => {
      ctx.navigate('/');
      return {
        output: <SuccessMsg>Navigating to homepage...</SuccessMsg>,
      };
    },
  },
  {
    name: 'projects',
    aliases: ['work', 'featured'],
    category: 'Navigation',
    description: 'List featured projects and navigate to Selected Work.',
    execute: (_args, ctx) => {
      setTimeout(() => ctx.navigate('/#work'), 250);
      return {
        output: (
          <div className="space-y-3 font-mono text-xs">
            <InfoHeader title="SELECTED WORK" subtitle="Navigating to #work..." />
            <div className="space-y-2">
              {ctx.projects.map((p) => (
                <div key={p.id} className="p-2.5 rounded bg-black/[0.02] dark:bg-white/[0.02] border border-gray-200/80 dark:border-[#282a32] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900 dark:text-[#ededeb]">{p.title}</span>
                    <span className="text-gray-400 dark:text-neutral-500 ml-2 text-[11px]">{p.subtitle}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => ctx.navigate(p.ctaLink)}
                    className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Open Case Study →
                  </button>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-gray-400 dark:text-neutral-500">
              Tip: You can also run <code className="text-blue-600 dark:text-blue-400 font-bold">project &lt;id&gt;</code> to view detailed specs directly inside the terminal.
            </div>
          </div>
        ),
      };
    },
  },
  {
    name: 'research',
    aliases: ['lab', 'data-research'],
    category: 'Navigation',
    description: 'Navigate to Research & Data section and view research landscape.',
    execute: (_args, ctx) => {
      setTimeout(() => ctx.navigate('/#research'), 250);
      return {
        output: (
          <div className="space-y-2 font-mono text-xs">
            <InfoHeader title="RESEARCH & DATA LANDSCAPE" subtitle="Navigating to #research..." />
            <p className="text-gray-700 dark:text-neutral-300">
              Focusing on Ghana's agricultural-chemical data ecosystem: source document discovery, OCR table parsing, verbatim quote verification, and canonical schema harmonization.
            </p>
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => ctx.navigate('/case-study/agrichem')}
                className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
              >
                Open AgriChem Case Study →
              </button>
            </div>
          </div>
        ),
      };
    },
  },
  {
    name: 'skills',
    category: 'Navigation',
    description: 'Navigate to Engineering Stack section.',
    execute: (_args, ctx) => {
      setTimeout(() => ctx.navigate('/#stack'), 250);
      return {
        output: (
          <div className="space-y-2 font-mono text-xs">
            <SuccessMsg>Navigating to Engineering Stack section (#stack)...</SuccessMsg>
            <p className="text-gray-500 dark:text-neutral-400">
              Tip: Run <code className="text-blue-600 dark:text-blue-400 font-bold">stack</code> to display all verified skills and categories right here in the terminal.
            </p>
          </div>
        ),
      };
    },
  },
  {
    name: 'experience',
    category: 'Navigation',
    description: 'Navigate to Experience section.',
    execute: (_args, ctx) => {
      setTimeout(() => ctx.navigate('/#experience'), 250);
      return {
        output: (
          <div className="space-y-3 font-mono text-xs">
            <InfoHeader title="EXPERIENCE & TRACK RECORD" subtitle="Navigating to #experience..." />
            <div className="space-y-2">
              {ctx.experience.map((item) => (
                <div key={item.company} className="py-1 border-b border-gray-200/40 dark:border-[#282a32]">
                  <div className="font-bold text-gray-900 dark:text-[#ededeb]">{item.company}</div>
                  <div className="text-blue-600 dark:text-blue-400 text-[11px]">{item.role}</div>
                  <div className="text-gray-600 dark:text-neutral-400 text-[11px] mt-0.5">{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        ),
      };
    },
  },
  {
    name: 'cv',
    aliases: ['resume'],
    category: 'Navigation',
    description: 'Open interactive curriculum vitae page (/cv).',
    execute: (_args, ctx) => {
      setTimeout(() => ctx.navigate('/cv'), 250);
      return {
        output: <SuccessMsg>Opening interactive CV (/cv)...</SuccessMsg>,
      };
    },
  },
  {
    name: 'contact',
    aliases: ['reach', 'email', 'phone'],
    category: 'Navigation',
    description: 'Show verified professional contact channels and social profiles.',
    execute: (_args, ctx) => ({
      output: (
        <div className="space-y-3 font-mono text-xs">
          <InfoHeader title="CONTACT & CONNECT" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded bg-black/[0.02] dark:bg-white/[0.02] border border-gray-200/80 dark:border-[#282a32] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 block">Direct Channels</span>
              <div>
                <span className="text-gray-500 dark:text-neutral-400 block text-[10px]">Email</span>
                <a href={`mailto:${ctx.contactInfo.email}`} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                  {ctx.contactInfo.email}
                </a>
              </div>
              <div>
                <span className="text-gray-500 dark:text-neutral-400 block text-[10px]">Phone</span>
                <a href="tel:+233247932712" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                  {ctx.contactInfo.phone}
                </a>
              </div>
            </div>
            <div className="p-3 rounded bg-black/[0.02] dark:bg-white/[0.02] border border-gray-200/80 dark:border-[#282a32] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 block">Social & Code</span>
              <div className="flex flex-wrap gap-2">
                {ctx.socialLinks.map((s) => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 rounded bg-gray-100 dark:bg-[#1c1e24] border border-gray-300 dark:border-[#282a32] text-[11px] font-medium text-gray-800 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {s.platform} ↗
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
    }),
  },
  {
    name: 'github',
    category: 'Navigation',
    description: 'Open GitHub profile (https://github.com/joshuawinyelsum) in a new tab.',
    execute: (_args, ctx) => {
      ctx.openExternal('https://github.com/joshuawinyelsum');
      return {
        output: <SuccessMsg>Opening GitHub profile (@joshuawinyelsum) in a new tab...</SuccessMsg>,
      };
    },
  },
  {
    name: 'linkedin',
    category: 'Navigation',
    description: 'Open LinkedIn profile in a new tab.',
    execute: (_args, ctx) => {
      const link = ctx.socialLinks.find((s) => s.platform.toLowerCase() === 'linkedin')?.url || 'https://www.linkedin.com/in/joshuawinyelsumakum';
      ctx.openExternal(link);
      return {
        output: <SuccessMsg>Opening LinkedIn profile in a new tab...</SuccessMsg>,
      };
    },
  },
];
