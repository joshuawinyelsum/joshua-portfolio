import React from 'react';
import { Command } from '../types';
import { InfoHeader } from '../components/TerminalUI';

export const technicalCommands: Command[] = [
  {
    name: 'stack',
    aliases: ['tech', 'technologies', 'skills-list'],
    category: 'Technical',
    description: 'Display verified technology stack, optionally filtered by category.',
    usage: 'stack [frontend|backend|database|tools]',
    examples: ['stack', 'stack backend', 'stack frontend', 'stack database', 'stack tools'],
    execute: (args, ctx) => {
      const categoryMap: Record<string, string> = {
        frontend: 'Frontend',
        ui: 'Frontend',
        backend: 'Backend & Systems',
        server: 'Backend & Systems',
        api: 'Backend & Systems',
        database: 'Data & Storage',
        db: 'Data & Storage',
        data: 'Data & Storage',
        storage: 'Data & Storage',
        tools: 'Engineering & Reliability',
        devops: 'Engineering & Reliability',
        testing: 'Engineering & Reliability',
        reliability: 'Engineering & Reliability',
        languages: 'Languages',
        lang: 'Languages',
      };

      const filter = args[0]?.toLowerCase().trim();

      if (filter && !categoryMap[filter] && filter !== 'all') {
        return {
          error: `Unsupported stack category: '${filter}'. Available options: frontend, backend, database, tools (or run 'stack' to view all).`,
        };
      }

      if (filter && filter !== 'all') {
        const canonicalCat = categoryMap[filter];
        const filteredSkills = ctx.skills.filter((s) => s.category.toLowerCase() === canonicalCat.toLowerCase());

        return {
          output: (
            <div className="space-y-3 font-mono text-xs">
              <InfoHeader title={`VERIFIED STACK: ${canonicalCat.toUpperCase()}`} />
              <div className="flex flex-wrap gap-2">
                {filteredSkills.map((s) => (
                  <span
                    key={s.name}
                    className="px-2.5 py-1 rounded bg-[#32332F] border border-[#45453F] text-[#F0EEE7] font-semibold"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          ),
        };
      }

      // Display all categories
      const categories = ['Languages', 'Backend & Systems', 'Data & Storage', 'Frontend', 'Engineering & Reliability'];

      return {
        output: (
          <div className="space-y-4 font-mono text-xs">
            <InfoHeader title="VERIFIED ENGINEERING STACK" subtitle="Sourced from project implementations" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map((cat) => {
                const catSkills = ctx.skills.filter((s) => s.category === cat);
                if (catSkills.length === 0) return null;
                return (
                  <div key={cat} className="p-3 rounded bg-[#292A27] border border-[#45453F]">
                    <div className="flex items-center justify-between mb-2 pb-1 border-b border-[#45453F]">
                      <span className="font-bold text-[11px] text-[#F0EEE7] uppercase tracking-wider">{cat}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {catSkills.map((s) => (
                        <span
                          key={s.name}
                          className="px-2 py-0.5 rounded bg-[#32332F] border border-[#45453F] text-[#F0EEE7] text-[11px]"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-[11px] text-[#A6A397] pt-1">
              Filter by category: <code className="text-[#82AAFF]">stack frontend</code> · <code className="text-[#82AAFF]">stack backend</code> · <code className="text-[#82AAFF]">stack database</code> · <code className="text-[#82AAFF]">stack tools</code>
            </div>
          </div>
        ),
      };
    },
    getSubcommands: () => ['frontend', 'backend', 'database', 'tools', 'languages'],
  },
  {
    name: 'architecture',
    aliases: ['system-design', 'philosophy'],
    category: 'Technical',
    description: 'Concise explanation of my software architecture & systems engineering approach.',
    execute: () => ({
      output: (
        <div className="space-y-3 font-mono text-xs leading-relaxed">
          <InfoHeader title="SOFTWARE ARCHITECTURE & SYSTEM DESIGN PHILOSOPHY" />
          <div className="space-y-2.5">
            <div className="border-l-2 border-[#82AAFF] pl-3">
              <span className="font-bold text-[#F0EEE7] block">01 / Problem-First Reality</span>
              <span className="text-[#A6A397]">
                Software must withstand messy input, unreliable connectivity, and changing requirements. I design data structures and constraints to model reality before choosing frameworks.
              </span>
            </div>
            <div className="border-l-2 border-[#82AAFF] pl-3">
              <span className="font-bold text-[#F0EEE7] block">02 / Relational Integrity & Schema Design</span>
              <span className="text-[#A6A397]">
                Data consistency starts at the storage boundary. Strict foreign keys, atomic transactions, idempotency keys, and explicit nullability prevent cascading failures.
              </span>
            </div>
            <div className="border-l-2 border-[#82AAFF] pl-3">
              <span className="font-bold text-[#F0EEE7] block">03 / Offline-First & Resilient Sync</span>
              <span className="text-[#A6A397]">
                In environments with patchy networks, applications must persist locally first (IndexedDB/Dexie), queue mutations reliably, and synchronize with deterministic conflict resolution.
              </span>
            </div>
            <div className="border-l-2 border-[#82AAFF] pl-3">
              <span className="font-bold text-[#F0EEE7] block">04 / Evidence-Backed Verification</span>
              <span className="text-[#A6A397]">
                Claims are empty without tests. Systems are hardened with unit suites (Vitest/Pytest), role-isolation integration tests, and end-to-end recovery verification (Playwright).
              </span>
            </div>
          </div>
        </div>
      ),
    }),
  },
  {
    name: 'interests',
    aliases: ['focus', 'passions'],
    category: 'Technical',
    description: 'Current technical interests and deep-dive engineering domains.',
    execute: () => ({
      output: (
        <div className="space-y-3 font-mono text-xs leading-relaxed">
          <InfoHeader title="TECHNICAL INTERESTS & FOCUS AREAS" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
            <div className="p-2.5 rounded bg-[#292A27] border border-[#45453F]">
              <span className="text-[#82AAFF] font-bold block mb-1">Backend & Systems Engineering</span>
              <p className="text-[#A6A397] text-[11px]">
                High-throughput APIs, asynchronous workers, connection budgeting, background task queues, and defensive middleware.
              </p>
            </div>
            <div className="p-2.5 rounded bg-[#292A27] border border-[#45453F]">
              <span className="text-[#82AAFF] font-bold block mb-1">Database Architecture & Storage</span>
              <p className="text-[#A6A397] text-[11px]">
                Relational modeling, query optimization, migration discipline, append-only event logs, and IndexedDB client storage.
              </p>
            </div>
            <div className="p-2.5 rounded bg-[#292A27] border border-[#45453F]">
              <span className="text-[#82AAFF] font-bold block mb-1">Distributed & Offline-First Systems</span>
              <p className="text-[#A6A397] text-[11px]">
                Bi-directional synchronization, conflict resolution algorithms, local queueing, and network-partition resilience.
              </p>
            </div>
            <div className="p-2.5 rounded bg-[#292A27] border border-[#45453F]">
              <span className="text-[#82AAFF] font-bold block mb-1">Data Pipelines & Machine Learning Systems</span>
              <p className="text-[#A6A397] text-[11px]">
                Schema harmonization, OCR verification registers, ETL pipelines, and applied machine learning integration.
              </p>
            </div>
          </div>
        </div>
      ),
    }),
  },
];
