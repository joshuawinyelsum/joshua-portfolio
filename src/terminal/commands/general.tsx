import React from 'react';
import { Command } from '../types';
import { InfoHeader, SuccessMsg } from '../components/TerminalUI';

export const generalCommands: Command[] = [
  {
    name: 'help',
    aliases: ['h', 'commands', '?'],
    category: 'General',
    description: 'Display all available commands or inspect a specific category.',
    usage: 'help [category]',
    examples: ['help', 'help recruiter', 'help filesystem', 'help linux', 'help projects'],
    execute: (args, ctx) => {
      const categoryArg = args[0]?.toLowerCase();

      const categories: Record<string, { desc: string; cmds: { name: string; desc: string; usage?: string }[] }> = {
        recruiter: {
          desc: 'Interactive engineering showcases and architecture exploration',
          cmds: [
            { name: 'tour', desc: '8-step guided interactive engineering tour', usage: 'tour [next|prev|jump <1-8>|exit]' },
            { name: 'inspect', desc: 'Deep technical architecture and systems specification', usage: 'inspect <cfss|mastery|cpw|agrichem>' },
            { name: 'trace', desc: 'Simulated request lifecycle trace across architectural layers', usage: 'trace <cfss|cpw|mastery> [next|prev|all]' },
            { name: 'challenge', desc: 'Interactive systems engineering challenges', usage: 'challenge [1-6] | challenge answer <id> <A-D>' },
            { name: 'security', desc: 'Audit terminal isolation controls & OWASP compliance', usage: 'security' },
          ],
        },
        filesystem: {
          desc: 'Simulated in-memory read-only virtual filesystem',
          cmds: [
            { name: 'pwd', desc: 'Print current virtual working directory' },
            { name: 'ls', desc: 'List files and directories', usage: 'ls [-la] [dir]' },
            { name: 'cd', desc: 'Change virtual working directory', usage: 'cd [dir]' },
            { name: 'tree', desc: 'Display virtual directory tree hierarchy', usage: 'tree [dir]' },
            { name: 'cat', desc: 'Print contents of a virtual file', usage: 'cat <file>' },
            { name: 'head', desc: 'Print first lines of a virtual file', usage: 'head [-n N] <file>' },
            { name: 'tail', desc: 'Print last lines of a virtual file', usage: 'tail [-n N] <file>' },
            { name: 'find', desc: 'Search for entries within virtual filesystem', usage: 'find [dir] [pattern]' },
            { name: 'stat', desc: 'Display simulated file metadata and inode status', usage: 'stat <file>' },
            { name: 'man', desc: 'Display manual page for supported commands', usage: 'man <command>' },
          ],
        },
        linux: {
          desc: 'Standard Linux developer workstation commands',
          cmds: [
            { name: 'whoami', desc: 'Print simulated developer identity' },
            { name: 'hostname', desc: 'Print simulated system network name' },
            { name: 'uname', desc: 'Print simulated kernel & OS details', usage: 'uname [-a]' },
            { name: 'date', desc: 'Display current date and UTC time' },
            { name: 'uptime', desc: 'Show system uptime and load average' },
            { name: 'ps', desc: 'Snapshot of active simulated processes', usage: 'ps [aux]' },
            { name: 'df', desc: 'Report virtual filesystem disk space usage', usage: 'df [-h]' },
            { name: 'free', desc: 'Display simulated memory allocation', usage: 'free [-h]' },
            { name: 'history', desc: 'Display current session command history' },
            { name: 'clear', desc: 'Clear terminal screen buffer' },
          ],
        },
        projects: {
          desc: 'Engineering project inspection and case study shortcuts',
          cmds: [
            { name: 'project', desc: 'Inspect project specs inside terminal', usage: 'project <cfss|mastery|cpw|agrichem>' },
            { name: 'open', desc: 'Navigate to allowlisted case study or section', usage: 'open <cfss|mastery|cpw|agrichem|cv>' },
            { name: 'cpw', desc: 'Direct shortcut to Coach Prosper’s World case study' },
            { name: 'cfss', desc: 'Direct shortcut to CFSS case study' },
            { name: 'mastery', desc: 'Direct shortcut to MasteryOS case study' },
            { name: 'agrichem', desc: 'Direct shortcut to AgriChem Research case study' },
          ],
        },
        navigation: {
          desc: 'Direct portfolio navigation and external channels',
          cmds: [
            { name: 'home', desc: 'Navigate to portfolio homepage' },
            { name: 'projects', desc: 'List featured work and navigate to #work' },
            { name: 'research', desc: 'View research landscape and navigate to #research' },
            { name: 'skills', desc: 'Navigate to verified technical stack' },
            { name: 'experience', desc: 'Navigate to experience timeline' },
            { name: 'cv', desc: 'Open interactive curriculum vitae' },
            { name: 'contact', desc: 'View direct contact channels (email, phone, socials)' },
            { name: 'github', desc: 'Open GitHub profile in new tab' },
            { name: 'linkedin', desc: 'Open LinkedIn profile in new tab' },
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
            { name: 'stats', desc: 'Display portfolio runtime stats and project counts' },
            { name: 'echo', desc: 'Print supplied text to terminal', usage: 'echo <text>' },
            { name: 'exit', desc: 'Close interactive command center' },
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
                  <div key={c.name} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-1 border-b border-[#45453F]/60">
                    <span className="text-[#82AAFF] font-bold shrink-0 w-28">
                      {c.name}
                    </span>
                    <span className="text-[#A6A397] text-xs flex-1">
                      {c.desc}
                    </span>
                    {c.usage && (
                      <span className="text-[#7A786E] text-[11px]">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(categories).map(([catKey, cat]) => (
                <div key={catKey} className="p-3 rounded-lg bg-[#292A27] border border-[#45453F]">
                  <div className="flex items-center justify-between mb-2 pb-1 border-b border-[#45453F]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#F0EEE7]">
                      {catKey}
                    </span>
                    <button
                      type="button"
                      onClick={() => ctx.runCommand(`help ${catKey}`)}
                      className="text-[10px] text-[#82AAFF] hover:underline cursor-pointer"
                    >
                      help {catKey} →
                    </button>
                  </div>
                  <div className="space-y-1">
                    {cat.cmds.slice(0, 4).map((c) => (
                      <div key={c.name} className="flex items-baseline justify-between text-xs">
                        <span className="text-[#82AAFF] font-semibold">{c.name}</span>
                        <span className="text-[#A6A397] text-[11px] truncate max-w-[180px]">{c.desc}</span>
                      </div>
                    ))}
                    {cat.cmds.length > 4 && (
                      <div className="text-[10px] text-[#7A786E] pt-1">
                        +{cat.cmds.length - 4} more commands...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-2 text-[11px] text-[#A6A397] border-t border-[#45453F] flex flex-wrap gap-x-4 gap-y-1">
              <span>Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-[#292A27] border border-[#45453F] text-[#F0EEE7]">TAB</kbd> for auto-complete</span>
              <span>Use <kbd className="px-1.5 py-0.5 rounded bg-[#292A27] border border-[#45453F] text-[#F0EEE7]">↑</kbd><kbd className="px-1.5 py-0.5 rounded bg-[#292A27] border border-[#45453F] text-[#F0EEE7]">↓</kbd> for history</span>
              <span>Run <span className="text-[#82AAFF] font-semibold">tour</span> for a guided walkthrough</span>
              <span>Run <span className="text-[#7EC28D] font-semibold">security</span> for boundary audit</span>
            </div>
          </div>
        ),
      };
    },
    getSubcommands: () => ['recruiter', 'filesystem', 'linux', 'projects', 'navigation', 'technical', 'theme', 'utility'],
  },
  {
    name: 'about',
    aliases: ['bio', 'intro'],
    category: 'General',
    description: 'Display concise engineer biography, education, and background.',
    execute: () => ({
      output: (
        <div className="p-3.5 rounded-lg bg-[#292A27] border border-[#45453F] font-mono text-xs space-y-2">
          <InfoHeader title="ABOUT JOSHUA WINYELSUM" subtitle="BSc Computer Science • UDS" />
          <p className="text-[#F0EEE7] leading-relaxed">
            I am a Computer Science student at the University for Development Studies and a software engineer focused on backend architecture, relational databases, offline-first systems, and data pipelines.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
            <div>
              <span className="text-[#7A786E] block text-[10px] uppercase font-bold">Focus</span>
              <span className="text-[#A6A397]">Backend Architecture, Relational Databases, Offline Systems</span>
            </div>
            <div>
              <span className="text-[#7A786E] block text-[10px] uppercase font-bold">Credentials</span>
              <span className="text-[#A6A397]">Google Cybersecurity Professional (94.52%), UDS BSc CS</span>
            </div>
          </div>
          <div className="text-[11px] text-[#A6A397] pt-1">
            Tip: For a guided tour, run <code className="text-[#82AAFF] font-bold">tour</code>. To view files, run <code className="text-[#82AAFF] font-bold">cat ABOUT.md</code>.
          </div>
        </div>
      ),
    }),
  },
  {
    name: 'stats',
    aliases: ['info'],
    category: 'General',
    description: 'Display portfolio statistics and project metrics.',
    execute: (_args, ctx) => {
      const live = ctx.projects.filter((p) => p.status === 'LIVE').length;
      const built = ctx.projects.filter((p) => p.status === 'BUILT').length;
      const research = ctx.projects.filter((p) => p.status === 'RESEARCH').length;

      return {
        output: (
          <div className="space-y-3 font-mono text-xs">
            <InfoHeader title="PORTFOLIO SYSTEM STATS" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 rounded bg-[#292A27] border border-[#45453F]">
                <div className="text-[#7A786E] text-[10px] uppercase font-bold">Total Projects</div>
                <div className="text-xl font-bold text-[#F0EEE7]">{ctx.projects.length}</div>
              </div>
              <div className="p-2.5 rounded bg-[#292A27] border border-[#45453F]">
                <div className="text-[#7EC28D] text-[10px] uppercase font-bold">Live In Production</div>
                <div className="text-xl font-bold text-[#7EC28D]">{live}</div>
              </div>
              <div className="p-2.5 rounded bg-[#292A27] border border-[#45453F]">
                <div className="text-[#82AAFF] text-[10px] uppercase font-bold">Built & Tested</div>
                <div className="text-xl font-bold text-[#82AAFF]">{built}</div>
              </div>
              <div className="p-2.5 rounded bg-[#292A27] border border-[#45453F]">
                <div className="text-[#C678DD] text-[10px] uppercase font-bold">Research Pipelines</div>
                <div className="text-xl font-bold text-[#C678DD]">{research}</div>
              </div>
            </div>
          </div>
        ),
      };
    },
  },
  {
    name: 'echo',
    category: 'General',
    description: 'Print text to the terminal.',
    usage: 'echo <text>',
    execute: (args) => {
      return {
        output: <div className="font-mono text-xs text-[#F0EEE7]">{args.join(' ')}</div>,
      };
    },
  },
  {
    name: 'exit',
    aliases: ['quit', 'q'],
    category: 'General',
    description: 'Close the command center terminal window.',
    execute: (_args, ctx) => {
      ctx.closeTerminal();
      return { isExit: true };
    },
  },
];
