import React from 'react';
import { Command, CommandContext } from '../types';
import { InfoHeader, SuccessMsg, ErrorMsg, CommandLink } from '../components/TerminalUI';

export const generalCommands: Command[] = [
  {
    name: 'help',
    aliases: ['h', 'commands', '?'],
    category: 'General',
    description: 'Display all available commands or inspect a specific category.',
    usage: 'help [category]',
    examples: ['help', 'help projects', 'help technical'],
    execute: (args, ctx) => {
      const categoryArg = args[0]?.toLowerCase();

      const categories: Record<string, { desc: string; cmds: { name: string; desc: string; usage?: string }[] }> = {
        general: {
          desc: 'Terminal and session controls',
          cmds: [
            { name: 'help', desc: 'Display command guide or category details', usage: 'help [category]' },
            { name: 'clear', desc: 'Clear terminal output history' },
            { name: 'history', desc: 'Show recent session command history' },
            { name: 'whoami', desc: 'Display engineering identity and background' },
            { name: 'about', desc: 'Concise engineer bio and portfolio overview' },
            { name: 'date', desc: 'Display current system date and UTC time' },
            { name: 'echo', desc: 'Print supplied text to terminal', usage: 'echo <text>' },
            { name: 'exit', desc: 'Close interactive command center' },
          ],
        },
        navigation: {
          desc: 'Direct portfolio navigation',
          cmds: [
            { name: 'home', desc: 'Navigate to portfolio homepage' },
            { name: 'about', desc: 'Navigate to About section' },
            { name: 'projects', desc: 'List featured work and navigate to #work' },
            { name: 'research', desc: 'View research landscape and navigate to #research' },
            { name: 'skills', desc: 'Navigate to verified technical stack' },
            { name: 'experience', desc: 'Navigate to experience timeline' },
            { name: 'cv', desc: 'Open interactive curriculum vitae' },
            { name: 'contact', desc: 'View direct channels (email, phone, socials)' },
            { name: 'github', desc: 'Open GitHub profile in new tab' },
            { name: 'linkedin', desc: 'Open LinkedIn profile in new tab' },
          ],
        },
        projects: {
          desc: 'Engineering project inspection and case study shortcuts',
          cmds: [
            { name: 'project', desc: 'Inspect project details inside terminal', usage: 'project <cfss|mastery|cpw|agrichem>' },
            { name: 'open', desc: 'Navigate directly to case study', usage: 'open <cfss|mastery|cpw|agrichem>' },
            { name: 'cpw', desc: 'Direct shortcut to Coach Prosper’s World case study' },
            { name: 'cfss', desc: 'Direct shortcut to CFSS case study' },
            { name: 'mastery', desc: 'Direct shortcut to MasteryOS case study' },
            { name: 'agrichem', desc: 'Direct shortcut to AgriChem Research case study' },
          ],
        },
        technical: {
          desc: 'Engineering stack, systems design, and research interests',
          cmds: [
            { name: 'stack', desc: 'Display verified tech stack by category', usage: 'stack [frontend|backend|database|tools]' },
            { name: 'architecture', desc: 'Principles of my system architecture approach' },
            { name: 'interests', desc: 'Core technical focus and engineering interests' },
          ],
        },
        theme: {
          desc: 'Website theme and appearance controls',
          cmds: [
            { name: 'theme', desc: 'Inspect or change website theme', usage: 'theme [dark|light|system|toggle]' },
          ],
        },
        utility: {
          desc: 'Terminal banners and diagnostic status',
          cmds: [
            { name: 'banner', desc: 'Display Joshua Winyelsum terminal banner' },
            { name: 'motd', desc: 'Display message of the day' },
            { name: 'version', desc: 'Display terminal engine build version' },
            { name: 'status', desc: 'Display portfolio runtime status and project verification' },
          ],
        },
      };

      if (categoryArg) {
        const foundKey = Object.keys(categories).find((k) => k.startsWith(categoryArg));
        if (!foundKey) {
          return {
            error: `Unknown help category: '${categoryArg}'. Available categories: ${Object.keys(categories).join(', ')}.`,
          };
        }
        const cat = categories[foundKey];
        return {
          output: (
            <div className="space-y-3 font-mono text-[13px]">
              <InfoHeader title={`Help: ${foundKey.toUpperCase()}`} subtitle={cat.desc} />
              <div className="grid grid-cols-1 gap-2">
                {cat.cmds.map((c) => (
                  <div key={c.name} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-1 border-b border-gray-200/40 dark:border-[#282a32]/60">
                    <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0 w-28">
                      {c.name}
                    </span>
                    <span className="text-gray-600 dark:text-neutral-300 text-xs flex-1">
                      {c.desc}
                    </span>
                    {c.usage && (
                      <span className="text-gray-400 dark:text-neutral-500 text-[11px]">
                        {c.usage}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ),
        };
      }

      return {
        output: (
          <div className="space-y-4 font-mono text-[13px]">
            <InfoHeader title="COMMAND CENTER DIRECTORY" subtitle="Explore portfolio via CLI" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(categories).map(([catKey, cat]) => (
                <div key={catKey} className="p-3 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] border border-gray-200/80 dark:border-[#282a32]">
                  <div className="flex items-center justify-between mb-2 pb-1 border-b border-gray-200/60 dark:border-[#282a32]">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-[#ededeb]">
                      {catKey}
                    </span>
                    <button
                      type="button"
                      onClick={() => ctx.runCommand(`help ${catKey}`)}
                      className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      help {catKey} →
                    </button>
                  </div>
                  <div className="space-y-1">
                    {cat.cmds.slice(0, 4).map((c) => (
                      <div key={c.name} className="flex items-baseline justify-between text-xs">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">{c.name}</span>
                        <span className="text-gray-500 dark:text-neutral-400 text-[11px] truncate max-w-[180px]">{c.desc}</span>
                      </div>
                    ))}
                    {cat.cmds.length > 4 && (
                      <div className="text-[10px] text-gray-400 dark:text-neutral-500 pt-1">
                        +{cat.cmds.length - 4} more commands...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-2 text-[11px] text-gray-500 dark:text-neutral-400 border-t border-gray-200/60 dark:border-[#282a32] flex flex-wrap gap-x-4 gap-y-1">
              <span>Tip: Press <kbd className="px-1 py-0.5 rounded bg-gray-200 dark:bg-[#282a32] text-gray-800 dark:text-neutral-200">TAB</kbd> for auto-complete</span>
              <span>Use <kbd className="px-1 py-0.5 rounded bg-gray-200 dark:bg-[#282a32] text-gray-800 dark:text-neutral-200">↑</kbd><kbd className="px-1 py-0.5 rounded bg-gray-200 dark:bg-[#282a32] text-gray-800 dark:text-neutral-200">↓</kbd> for history</span>
              <span>Type <span className="text-blue-600 dark:text-blue-400">theme toggle</span> to switch mode</span>
            </div>
          </div>
        ),
      };
    },
    getSubcommands: () => ['general', 'navigation', 'projects', 'technical', 'theme', 'utility'],
  },
  {
    name: 'clear',
    aliases: ['cls'],
    category: 'General',
    description: 'Clear terminal screen and command history.',
    execute: (_args, ctx) => {
      ctx.clearHistory();
      return { isClear: true };
    },
  },
  {
    name: 'history',
    category: 'General',
    description: 'Display recent commands entered during the current session.',
    execute: (_args, ctx) => {
      if (ctx.commandHistory.length === 0) {
        return {
          output: <div className="text-gray-500 dark:text-neutral-400 font-mono text-xs">No previous commands entered in this session.</div>,
        };
      }
      return {
        output: (
          <div className="space-y-1 font-mono text-xs">
            <InfoHeader title="SESSION COMMAND HISTORY" />
            <div className="space-y-0.5">
              {ctx.commandHistory.map((cmd, i) => (
                <div key={i} className="flex items-center gap-3 py-0.5">
                  <span className="text-gray-400 dark:text-neutral-600 w-6 text-right tabular-nums">{i + 1}</span>
                  <span className="text-gray-900 dark:text-[#ededeb]">{cmd}</span>
                </div>
              ))}
            </div>
          </div>
        ),
      };
    },
  },
  {
    name: 'whoami',
    category: 'General',
    description: 'Display engineering identity, university, and core focus.',
    execute: () => ({
      output: (
        <div className="space-y-2 font-mono text-[13px] leading-relaxed">
          <InfoHeader title="IDENTITY & FOCUS" />
          <div className="text-gray-900 dark:text-[#ededeb] font-bold text-base">
            Joshua Winyelsum
          </div>
          <div className="text-gray-600 dark:text-neutral-400 text-xs">
            Software & Systems Engineer · Computer Science Student
          </div>
          <div className="text-gray-700 dark:text-neutral-300 text-xs">
            BSc Computer Science @ University for Development Studies (Tamale, Ghana)
          </div>
          <div className="p-3 rounded bg-blue-500/5 border border-blue-500/20 text-gray-700 dark:text-neutral-300 text-xs space-y-1">
            <p className="font-semibold text-gray-900 dark:text-[#ededeb]">Core Technical Disciplines:</p>
            <p>• Backend architecture & relational data modeling (Next.js, FastAPI, PostgreSQL, Prisma)</p>
            <p>• Offline-first resilient client systems (IndexedDB, Dexie, bi-directional sync)</p>
            <p>• Data research pipelines, OCR extraction & canonical schema harmonization</p>
            <p>• Evidence-backed engineering verified by automated test suites</p>
          </div>
        </div>
      ),
    }),
  },
  {
    name: 'about',
    category: 'General',
    description: 'Display concise engineer introduction with option to navigate to About section.',
    execute: (_args, ctx) => ({
      output: (
        <div className="space-y-2 font-mono text-xs leading-relaxed">
          <InfoHeader title="ABOUT JOSHUA WINYELSUM" />
          <p className="text-gray-700 dark:text-neutral-300">
            I build resilient backend systems, database architectures, and data pipelines. I treat software engineering as an evidence-driven discipline where system architecture must be backed by automated test suites, clean relational constraints, and real-world failure tolerance.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => ctx.navigate('/#about')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-gray-900 dark:bg-[#ededeb] text-white dark:text-[#121316] font-semibold text-[11px] hover:opacity-90 cursor-pointer"
            >
              Navigate to About Section →
            </button>
          </div>
        </div>
      ),
    }),
  },
  {
    name: 'date',
    category: 'General',
    description: 'Display current system date and UTC time.',
    execute: () => {
      const now = new Date();
      return {
        output: (
          <div className="font-mono text-xs space-y-1">
            <div className="text-gray-900 dark:text-[#ededeb]">
              <span className="text-gray-400 dark:text-neutral-500">Local: </span>
              {now.toString()}
            </div>
            <div className="text-gray-600 dark:text-neutral-400">
              <span className="text-gray-400 dark:text-neutral-500">UTC: </span>
              {now.toISOString()}
            </div>
          </div>
        ),
      };
    },
  },
  {
    name: 'echo',
    category: 'General',
    description: 'Print supplied text safely.',
    usage: 'echo <text>',
    examples: ['echo Hello world', 'echo Testing output'],
    execute: (args) => {
      if (args.length === 0) {
        return {
          output: <div className="text-gray-400 dark:text-neutral-500 font-mono text-xs italic">Usage: echo &lt;text&gt;</div>,
        };
      }
      return {
        output: <div className="text-gray-800 dark:text-neutral-200 font-mono text-xs">{args.join(' ')}</div>,
      };
    },
  },
  {
    name: 'exit',
    aliases: ['quit', 'close', 'q'],
    category: 'General',
    description: 'Close the command center terminal window.',
    execute: (_args, ctx) => {
      ctx.closeTerminal();
      return {
        isExit: true,
        output: <SuccessMsg>Terminal console closed.</SuccessMsg>,
      };
    },
  },
];
