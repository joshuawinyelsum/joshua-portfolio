import React from 'react';
import { Command } from '../types';
import { StatusBadge, InfoHeader, SuccessMsg, CommandLink } from '../components/TerminalUI';

function resolveProjectId(query: string): string | null {
  const q = query.toLowerCase().trim();
  if (['cpw', 'coach', 'coach-prospers-world', 'coachprospersworld'].includes(q)) return 'coach-prospers-world';
  if (['cfss', 'community', 'field-survey'].includes(q)) return 'cfss';
  if (['mastery', 'masteryos', 'mastery-os'].includes(q)) return 'mastery-os';
  if (['agrichem', 'ghanaagrichem', 'cocoa'].includes(q)) return 'agrichem';
  return null;
}

export const projectCommands: Command[] = [
  {
    name: 'project',
    aliases: ['proj', 'inspect'],
    category: 'Projects',
    description: 'Display in-depth engineering specs and evidence for a project.',
    usage: 'project <cfss|mastery|cpw|agrichem>',
    examples: ['project cfss', 'project cpw', 'project mastery', 'project agrichem'],
    execute: (args, ctx) => {
      if (args.length === 0) {
        return {
          output: (
            <div className="space-y-3 font-mono text-xs">
              <InfoHeader title="PROJECT DIRECTORY" subtitle="Inspect detailed engineering specs in terminal" />
              <div className="space-y-2">
                {ctx.projects.map((p) => (
                  <div key={p.id} className="p-3 rounded bg-black/[0.02] dark:bg-white/[0.02] border border-gray-200/80 dark:border-[#282a32] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-[#ededeb]">{p.title}</span>
                        <StatusBadge status={p.status} />
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-neutral-400">{p.subtitle}</div>
                    </div>
                    <div className="flex items-center gap-2 pt-1 sm:pt-0">
                      <button
                        type="button"
                        onClick={() => {
                          const short = p.id === 'coach-prospers-world' ? 'cpw' : p.id;
                          ctx.runCommand(`project ${short}`);
                        }}
                        className="px-2 py-1 rounded bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20 text-[11px] font-semibold cursor-pointer"
                      >
                        Inspect $
                      </button>
                      <button
                        type="button"
                        onClick={() => ctx.navigate(p.ctaLink)}
                        className="px-2 py-1 rounded bg-gray-200 dark:bg-[#1c1e24] text-gray-700 dark:text-neutral-300 hover:text-black dark:hover:text-white text-[11px] font-semibold cursor-pointer"
                      >
                        View Page ↗
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-[11px] text-gray-400 dark:text-neutral-500">
                Usage: <code className="text-blue-600 dark:text-blue-400 font-bold">project &lt;name&gt;</code> or <code className="text-blue-600 dark:text-blue-400 font-bold">open &lt;name&gt;</code> (e.g. project cfss, open cpw).
              </div>
            </div>
          ),
        };
      }

      const targetId = resolveProjectId(args[0]);
      if (!targetId) {
        return {
          error: `Unknown project: '${args[0]}'. Available projects: cfss, mastery, cpw, agrichem.`,
        };
      }

      const project = ctx.projects.find((p) => p.id === targetId);
      if (!project) {
        return { error: `Project '${targetId}' not found in portfolio registry.` };
      }

      return {
        output: (
          <div className="space-y-4 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-gray-300/60 dark:border-[#282a32] gap-2">
              <div>
                <span className="text-[10px] text-gray-400 dark:text-neutral-500 uppercase tracking-widest block">{project.category}</span>
                <h3 className="text-base font-bold text-gray-900 dark:text-[#ededeb]">{project.title}</h3>
                <p className="text-gray-500 dark:text-neutral-400 text-[11px]">{project.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={project.status} />
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold"
                  >
                    LIVE ↗
                  </a>
                )}
              </div>
            </div>

            {/* Overview / Problem */}
            <div className="space-y-2">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-neutral-500 block">Overview</span>
                <p className="text-gray-700 dark:text-neutral-300 leading-relaxed text-[12px]">{project.description}</p>
              </div>
              {project.problem && (
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-neutral-500 block">Problem Statement</span>
                  <p className="text-gray-600 dark:text-neutral-400 leading-relaxed text-[12px]">{project.problem}</p>
                </div>
              )}
            </div>

            {/* System Architecture */}
            {project.system && (
              <div className="p-3 rounded bg-black/[0.02] dark:bg-white/[0.02] border border-gray-200/80 dark:border-[#282a32]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-neutral-500 block mb-1">Architecture & System</span>
                <p className="text-gray-700 dark:text-neutral-300 leading-relaxed text-[12px]">{project.system}</p>
              </div>
            )}

            {/* Capabilities */}
            {project.capabilities && project.capabilities.length > 0 && (
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-neutral-500 block mb-1.5">Key Capabilities</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                  {project.capabilities.map((cap, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-gray-600 dark:text-neutral-400">
                      <span className="text-blue-500 shrink-0">•</span>
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech stack */}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-neutral-500 block mb-1.5">Verified Technologies</span>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#1c1e24] border border-gray-200 dark:border-[#282a32] text-[10px] font-medium text-gray-700 dark:text-neutral-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 border-t border-gray-200/60 dark:border-[#282a32] flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => ctx.navigate(project.ctaLink)}
                className="px-3 py-1 rounded bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-700 cursor-pointer"
              >
                Open Full Case Study Page →
              </button>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded bg-gray-200 dark:bg-[#1c1e24] text-gray-800 dark:text-neutral-200 font-bold text-[11px] hover:opacity-90"
                >
                  Visit Live Production Website ↗
                </a>
              )}
            </div>
          </div>
        ),
      };
    },
    getSubcommands: () => ['cfss', 'mastery', 'cpw', 'agrichem'],
  },
  {
    name: 'open',
    category: 'Projects',
    description: 'Navigate directly to a project case study page.',
    usage: 'open <cfss|mastery|cpw|agrichem>',
    examples: ['open cfss', 'open cpw', 'open mastery', 'open agrichem'],
    execute: (args, ctx) => {
      if (args.length === 0) {
        return {
          error: "Usage: open <cfss|mastery|cpw|agrichem>. Run 'projects' to list all.",
        };
      }
      const targetId = resolveProjectId(args[0]);
      if (!targetId) {
        return {
          error: `Unknown project: '${args[0]}'. Available options: cfss, mastery, cpw, agrichem.`,
        };
      }
      const project = ctx.projects.find((p) => p.id === targetId);
      if (!project) {
        return { error: `Project '${targetId}' not found.` };
      }
      setTimeout(() => ctx.navigate(project.ctaLink), 200);
      return {
        output: <SuccessMsg>Navigating to {project.title} case study ({project.ctaLink})...</SuccessMsg>,
      };
    },
    getSubcommands: () => ['cfss', 'mastery', 'cpw', 'agrichem'],
  },
  // Dedicated shortcuts
  {
    name: 'cpw',
    aliases: ['coach', 'coachprospersworld'],
    category: 'Projects',
    description: "Direct shortcut to Coach Prosper's World case study.",
    execute: (_args, ctx) => {
      setTimeout(() => ctx.navigate('/case-study/coach-prospers-world'), 200);
      return {
        output: <SuccessMsg>Navigating to Coach Prosper’s World case study...</SuccessMsg>,
      };
    },
  },
  {
    name: 'cfss',
    category: 'Projects',
    description: 'Direct shortcut to Community Field Survey System case study.',
    execute: (_args, ctx) => {
      setTimeout(() => ctx.navigate('/case-study/cfss'), 200);
      return {
        output: <SuccessMsg>Navigating to CFSS case study...</SuccessMsg>,
      };
    },
  },
  {
    name: 'mastery',
    aliases: ['masteryos', 'mastery-os'],
    category: 'Projects',
    description: 'Direct shortcut to MasteryOS case study.',
    execute: (_args, ctx) => {
      setTimeout(() => ctx.navigate('/case-study/mastery-os'), 200);
      return {
        output: <SuccessMsg>Navigating to MasteryOS case study...</SuccessMsg>,
      };
    },
  },
  {
    name: 'agrichem',
    aliases: ['cocoa'],
    category: 'Projects',
    description: 'Direct shortcut to AgriChem Data Research case study.',
    execute: (_args, ctx) => {
      setTimeout(() => ctx.navigate('/case-study/agrichem'), 200);
      return {
        output: <SuccessMsg>Navigating to AgriChem Research case study...</SuccessMsg>,
      };
    },
  },
];
