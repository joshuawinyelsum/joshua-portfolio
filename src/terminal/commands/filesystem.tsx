import React from 'react';
import { Command } from '../types';
import {
  normalizeVirtualPath,
  getVirtualEntry,
  listVirtualDirectory,
  readVirtualFile,
  generateAsciiTree,
  findVirtualEntries,
} from '../virtualFilesystem';
import { InfoHeader, ErrorMsg, SuccessMsg } from '../components/TerminalUI';

export const filesystemCommands: Command[] = [
  {
    name: 'pwd',
    category: 'Filesystem',
    description: 'Print current virtual working directory.',
    usage: 'pwd',
    execute: (_args, ctx) => {
      return {
        output: (
          <div className="font-mono text-xs text-[#F0EEE7]">
            {ctx.cwd}
          </div>
        ),
      };
    },
  },
  {
    name: 'ls',
    aliases: ['dir'],
    category: 'Filesystem',
    description: 'List directory contents in the virtual filesystem.',
    usage: 'ls [-la] [directory]',
    examples: ['ls', 'ls -la', 'ls projects', 'ls /home/joshua'],
    execute: (args, ctx) => {
      let showAll = false;
      let longFormat = false;
      let targetPathStr = '';

      for (const arg of args) {
        if (arg.startsWith('-')) {
          if (arg.includes('a')) showAll = true;
          if (arg.includes('l')) longFormat = true;
        } else if (!targetPathStr) {
          targetPathStr = arg;
        }
      }

      const norm = normalizeVirtualPath(ctx.cwd, targetPathStr || undefined);
      if (!norm.success) {
        return { error: norm.error };
      }

      const entry = getVirtualEntry(norm.path);
      if (!entry) {
        return { error: `ls: cannot access '${targetPathStr}': No such file or directory` };
      }

      if (entry.type === 'file') {
        return {
          output: (
            <div className="font-mono text-xs text-[#F0EEE7]">
              {entry.name}
            </div>
          ),
        };
      }

      const items = listVirtualDirectory(norm.path);
      if (!items) {
        return { error: `ls: cannot read directory '${norm.path}'` };
      }

      if (longFormat) {
        return {
          output: (
            <div className="space-y-1 font-mono text-xs text-[#A6A397] overflow-x-auto max-w-full">
              <div className="text-[11px] text-[#7A786E] pb-0.5 border-b border-[#45453F]">
                total {items.length}
              </div>
              {showAll && (
                <>
                  <div className="flex gap-4">
                    <span className="w-24 text-[#82AAFF]">drwxr-xr-x</span>
                    <span className="w-12 text-[#7A786E]">joshua</span>
                    <span className="w-12 text-[#7A786E]">joshua</span>
                    <span className="w-16 text-right text-[#7A786E]">4096</span>
                    <span className="w-28 text-[#7A786E]">Nov 2 01:00</span>
                    <span className="text-[#82AAFF] font-bold">.</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-24 text-[#82AAFF]">drwxr-xr-x</span>
                    <span className="w-12 text-[#7A786E]">joshua</span>
                    <span className="w-12 text-[#7A786E]">joshua</span>
                    <span className="w-16 text-right text-[#7A786E]">4096</span>
                    <span className="w-28 text-[#7A786E]">Nov 2 01:00</span>
                    <span className="text-[#82AAFF] font-bold">..</span>
                  </div>
                </>
              )}
              {items.map((it) => (
                <div key={it.name} className="flex gap-4 items-center">
                  <span className={`w-24 ${it.type === 'directory' ? 'text-[#82AAFF]' : 'text-[#A6A397]'}`}>
                    {it.permissions}
                  </span>
                  <span className="w-12 text-[#7A786E]">{it.owner}</span>
                  <span className="w-12 text-[#7A786E]">{it.group}</span>
                  <span className="w-16 text-right text-[#7A786E]">{it.type === 'directory' ? 4096 : it.size}</span>
                  <span className="w-28 text-[#7A786E]">{it.modified}</span>
                  <span className={it.type === 'directory' ? 'text-[#82AAFF] font-bold' : 'text-[#F0EEE7]'}>
                    {it.name}{it.type === 'directory' ? '/' : ''}
                  </span>
                </div>
              ))}
            </div>
          ),
        };
      }

      // Short format grid
      return {
        output: (
          <div className="flex flex-wrap gap-x-6 gap-y-1.5 font-mono text-xs">
            {showAll && (
              <>
                <span className="text-[#82AAFF] font-bold">./</span>
                <span className="text-[#82AAFF] font-bold">../</span>
              </>
            )}
            {items.map((it) => (
              <span
                key={it.name}
                className={it.type === 'directory' ? 'text-[#82AAFF] font-bold' : 'text-[#F0EEE7]'}
              >
                {it.name}{it.type === 'directory' ? '/' : ''}
              </span>
            ))}
          </div>
        ),
      };
    },
    getSubcommands: (_args, ctx) => {
      const items = listVirtualDirectory(ctx.cwd) || [];
      return items.map((it) => it.name);
    },
  },
  {
    name: 'cd',
    category: 'Filesystem',
    description: 'Change current virtual working directory.',
    usage: 'cd [directory]',
    examples: ['cd', 'cd ..', 'cd ~', 'cd projects', 'cd /etc'],
    execute: (args, ctx) => {
      const target = args[0] || '~';
      const norm = normalizeVirtualPath(ctx.cwd, target);

      if (!norm.success) {
        return { error: norm.error };
      }

      const entry = getVirtualEntry(norm.path);
      if (!entry) {
        return { error: `cd: ${target}: No such file or directory` };
      }
      if (entry.type !== 'directory') {
        return { error: `cd: ${target}: Not a directory` };
      }

      ctx.setCwd(norm.path);
      return {};
    },
    getSubcommands: (_args, ctx) => {
      const items = listVirtualDirectory(ctx.cwd) || [];
      return items.filter((it) => it.type === 'directory').map((it) => it.name);
    },
  },
  {
    name: 'tree',
    category: 'Filesystem',
    description: 'Display predefined virtual filesystem tree hierarchy.',
    usage: 'tree [directory]',
    examples: ['tree', 'tree /home/joshua', 'tree projects'],
    execute: (args, ctx) => {
      const target = args[0] || ctx.cwd;
      const norm = normalizeVirtualPath(ctx.cwd, target);
      if (!norm.success) return { error: norm.error };

      const treeStr = generateAsciiTree(norm.path);
      return {
        output: (
          <div className="space-y-2 font-mono text-xs">
            <InfoHeader title="VIRTUAL FILESYSTEM TREE" subtitle={norm.path} />
            <pre className="p-3 rounded bg-[#292A27] border border-[#45453F] text-[#F0EEE7] text-xs whitespace-pre overflow-x-auto leading-relaxed">
              {treeStr}
            </pre>
          </div>
        ),
      };
    },
  },
  {
    name: 'cat',
    category: 'Filesystem',
    description: 'Print content of a virtual file.',
    usage: 'cat <file>',
    examples: ['cat README.md', 'cat ABOUT.md', 'cat projects/cfss/README.md', 'cat /etc/os-release'],
    execute: (args, ctx) => {
      if (args.length === 0) {
        return { error: 'Usage: cat <file>' };
      }

      const norm = normalizeVirtualPath(ctx.cwd, args[0]);
      if (!norm.success) return { error: norm.error };

      const res = readVirtualFile(norm.path);
      if (!res.success) {
        return { error: `cat: ${args[0]}: ${res.error}` };
      }

      return {
        output: (
          <div className="space-y-1.5 font-mono text-xs">
            <div className="text-[11px] text-[#A6A397] font-semibold border-b border-[#45453F] pb-1">
              File: <span className="text-[#F0EEE7]">{norm.path}</span>
            </div>
            <pre className="p-3 rounded bg-[#292A27] border border-[#45453F] text-[#F0EEE7] text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {res.content}
            </pre>
          </div>
        ),
      };
    },
    getSubcommands: (_args, ctx) => {
      const items = listVirtualDirectory(ctx.cwd) || [];
      return items.filter((it) => it.type === 'file').map((it) => it.name);
    },
  },
  {
    name: 'head',
    category: 'Filesystem',
    description: 'Print the first lines of a virtual file.',
    usage: 'head [-n N] <file>',
    examples: ['head README.md', 'head -n 5 ABOUT.md'],
    execute: (args, ctx) => {
      if (args.length === 0) {
        return { error: 'Usage: head [-n N] <file>' };
      }

      let count = 10;
      let filename = '';

      for (let i = 0; i < args.length; i++) {
        if (args[i] === '-n' && args[i + 1]) {
          const parsed = parseInt(args[i + 1], 10);
          if (!isNaN(parsed) && parsed > 0) {
            count = parsed;
            i++;
          }
        } else if (!filename) {
          filename = args[i];
        }
      }

      if (!filename) return { error: 'Usage: head [-n N] <file>' };

      const norm = normalizeVirtualPath(ctx.cwd, filename);
      if (!norm.success) return { error: norm.error };

      const res = readVirtualFile(norm.path);
      if (!res.success) return { error: `head: ${filename}: ${res.error}` };

      const lines = (res.content || '').split('\n').slice(0, count).join('\n');
      return {
        output: (
          <pre className="p-3 rounded bg-[#292A27] border border-[#45453F] text-[#F0EEE7] font-mono text-xs whitespace-pre-wrap leading-relaxed">
            {lines}
          </pre>
        ),
      };
    },
  },
  {
    name: 'tail',
    category: 'Filesystem',
    description: 'Print the last lines of a virtual file.',
    usage: 'tail [-n N] <file>',
    examples: ['tail README.md', 'tail -n 5 /var/log/portfolio.log'],
    execute: (args, ctx) => {
      if (args.length === 0) {
        return { error: 'Usage: tail [-n N] <file>' };
      }

      let count = 10;
      let filename = '';

      for (let i = 0; i < args.length; i++) {
        if (args[i] === '-n' && args[i + 1]) {
          const parsed = parseInt(args[i + 1], 10);
          if (!isNaN(parsed) && parsed > 0) {
            count = parsed;
            i++;
          }
        } else if (!filename) {
          filename = args[i];
        }
      }

      if (!filename) return { error: 'Usage: tail [-n N] <file>' };

      const norm = normalizeVirtualPath(ctx.cwd, filename);
      if (!norm.success) return { error: norm.error };

      const res = readVirtualFile(norm.path);
      if (!res.success) return { error: `tail: ${filename}: ${res.error}` };

      const allLines = (res.content || '').split('\n');
      const lines = allLines.slice(Math.max(0, allLines.length - count)).join('\n');
      return {
        output: (
          <pre className="p-3 rounded bg-[#292A27] border border-[#45453F] text-[#F0EEE7] font-mono text-xs whitespace-pre-wrap leading-relaxed">
            {lines}
          </pre>
        ),
      };
    },
  },
  {
    name: 'find',
    category: 'Filesystem',
    description: 'Search for files or directories within the virtual filesystem.',
    usage: 'find [directory] [pattern]',
    examples: ['find', 'find /home/joshua', 'find . README.md'],
    execute: (args, ctx) => {
      let target = ctx.cwd;
      let query = '';

      if (args.length === 1) {
        if (args[0].startsWith('-') || args[0].includes('.')) {
          query = args[0];
        } else {
          target = args[0];
        }
      } else if (args.length >= 2) {
        target = args[0];
        query = args[1];
      }

      const norm = normalizeVirtualPath(ctx.cwd, target);
      if (!norm.success) return { error: norm.error };

      const matches = findVirtualEntries(norm.path, query || undefined);
      return {
        output: (
          <div className="space-y-1 font-mono text-xs">
            <div className="text-[11px] text-[#A6A397] pb-1 border-b border-[#45453F]">
              Found {matches.length} entries matching in {norm.path}:
            </div>
            {matches.map((m) => (
              <div key={m} className="text-[#F0EEE7]">
                {m}
              </div>
            ))}
          </div>
        ),
      };
    },
  },
  {
    name: 'stat',
    category: 'Filesystem',
    description: 'Display simulated file or filesystem status.',
    usage: 'stat <file>',
    examples: ['stat README.md', 'stat /etc/os-release'],
    execute: (args, ctx) => {
      if (args.length === 0) return { error: 'Usage: stat <file>' };

      const norm = normalizeVirtualPath(ctx.cwd, args[0]);
      if (!norm.success) return { error: norm.error };

      const entry = getVirtualEntry(norm.path);
      if (!entry) return { error: `stat: cannot stat '${args[0]}': No such file or directory` };

      const isDir = entry.type === 'directory';
      const size = isDir ? 4096 : entry.size;
      const blocks = Math.ceil(size / 512);

      return {
        output: (
          <div className="p-3 rounded bg-[#292A27] border border-[#45453F] font-mono text-xs text-[#F0EEE7] space-y-1 leading-relaxed">
            <div>  File: {norm.path}</div>
            <div>  Size: {size}	Blocks: {blocks}	IO Block: 4096   {isDir ? 'directory' : 'regular file'}</div>
            <div>Device: 0025h/37d	Inode: 10485761	Links: {isDir ? 3 : 1}</div>
            <div>Access: ({isDir ? '0755' : '0644'}/{entry.permissions})  Uid: ( 1000/{entry.owner})   Gid: ( 1000/{entry.group})</div>
            <div>Access: 2026-11-02 01:00:00.000000000 +0000</div>
            <div>Modify: 2026-11-02 01:00:00.000000000 +0000</div>
            <div>Change: 2026-11-02 01:00:00.000000000 +0000</div>
            <div> Birth: 2026-11-02 01:00:00.000000000 +0000</div>
          </div>
        ),
      };
    },
  },
  {
    name: 'man',
    category: 'Filesystem',
    description: 'Display simulated manual page for a command.',
    usage: 'man <command>',
    examples: ['man tour', 'man inspect', 'man trace', 'man challenge', 'man cd'],
    execute: (args) => {
      if (args.length === 0) {
        return { error: 'What manual page do you want? Usage: man <command>' };
      }

      const target = args[0].toLowerCase();
      const manualEntries: Record<string, { title: string; section: string; synopsis: string; description: string }> = {
        tour: {
          title: 'TOUR(1)',
          section: 'Recruiter Experience',
          synopsis: 'tour [next | prev | jump <1-8> | exit]',
          description: 'Launches an 8-step guided interactive technical tour of Joshua Winyelsum\'s background, production platform achievements, offline-first systems architecture, and research.',
        },
        inspect: {
          title: 'INSPECT(1)',
          section: 'Architecture Exploration',
          synopsis: 'inspect <cfss | mastery | cpw | agrichem>',
          description: 'Displays a comprehensive architectural specification including frontend/backend layers, database schemas, offline-first caching mechanisms, data flow diagrams, decisions, and known trade-offs.',
        },
        trace: {
          title: 'TRACE(1)',
          section: 'Systems Simulation',
          synopsis: 'trace <cfss | cpw | mastery> [next | prev | all | reset]',
          description: 'Simulates a multi-layered request lifecycle trace illustrating how user actions transition from client-side Zod validation through offline IndexedDB persistence, FastAPI/NextAuth authorization, and PostgreSQL transactions.',
        },
        challenge: {
          title: 'CHALLENGE(1)',
          section: 'Technical Assessment',
          synopsis: 'challenge [id] | challenge answer <id> <A|B|C|D>',
          description: 'Provides 6 controlled multiple-choice systems engineering challenges covering database query optimization, idempotent retries, race conditions, offline sync reconciliation, cache stampede mitigation, and distributed split-brain consensus.',
        },
        security: {
          title: 'SECURITY(1)',
          section: 'Security & Boundaries',
          synopsis: 'security',
          description: 'Audits the active security boundaries and isolation controls enforcing the read-only simulated environment in compliance with OWASP Injection and XSS Prevention guidelines.',
        },
        cd: {
          title: 'CD(1)',
          section: 'Filesystem Navigation',
          synopsis: 'cd [directory]',
          description: 'Changes the current virtual directory within the in-memory simulated filesystem. Strictly prevents escaping above the virtual root (/).',
        },
        cat: {
          title: 'CAT(1)',
          section: 'Filesystem Utilities',
          synopsis: 'cat <file>',
          description: 'Reads and displays the text content of a virtual file safely inside the terminal UI.',
        },
      };

      const entry = manualEntries[target];
      if (!entry) {
        return { error: `No manual entry for '${target}'. Try 'man tour', 'man inspect', 'man trace', 'man challenge', or 'man security'.` };
      }

      return {
        output: (
          <div className="p-3 rounded bg-[#292A27] border border-[#45453F] font-mono text-xs text-[#F0EEE7] space-y-2 leading-relaxed">
            <div className="flex justify-between font-bold border-b border-[#45453F] pb-1 text-[#82AAFF]">
              <span>{entry.title}</span>
              <span>{entry.section}</span>
            </div>
            <div>
              <span className="font-bold text-[#A6A397]">NAME</span>
              <p className="pl-4">{target}: simulated developer command</p>
            </div>
            <div>
              <span className="font-bold text-[#A6A397]">SYNOPSIS</span>
              <p className="pl-4 font-mono text-[#7EC28D]">{entry.synopsis}</p>
            </div>
            <div>
              <span className="font-bold text-[#A6A397]">DESCRIPTION</span>
              <p className="pl-4 text-[#F0EEE7] leading-relaxed">{entry.description}</p>
            </div>
          </div>
        ),
      };
    },
  },
];
