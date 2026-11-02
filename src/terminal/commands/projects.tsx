import React from 'react';
import { Command } from '../types';
import { StatusBadge, InfoHeader, SuccessMsg } from '../components/TerminalUI';
import { isApprovedInternalRoute } from '../navigationAllowlist';

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
    aliases: ['proj', 'specs'],
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
                  <div key={p.id} className="p-3 rounded bg-[#292A27] border border-[#45453F] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#F0EEE7]">{p.title}</span>
                        <StatusBadge status={p.status} />
                      </div>
                      <div className="text-[11px] text-[#A6A397]">{p.subtitle}</div>
                    </div>
                    <div className="flex items-center gap-2 pt-1 sm:pt-0">
                      <button
                        type="button"
                        onClick={() => {
                          const short = p.id === 'coach-prospers-world' ? 'cpw' : p.id;
                          ctx.runCommand(`project ${short}`);
                        }}
                        className="px-2 py-1 rounded bg-[#82AAFF]/15 text-[#82AAFF] hover:bg-[#82AAFF]/25 text-[11px] font-semibold cursor-pointer transition-colors"
                      >
                        Inspect $
                      </button>
                      <button
                        type="button"
                        onClick={() => ctx.navigate(p.ctaLink)}
                        className="px-2 py-1 rounded bg-[#32332F] text-[#F0EEE7] hover:bg-[#3E403B] text-[11px] font-semibold cursor-pointer transition-colors"
                      >
                        View Page ↗
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-[11px] text-[#A6A397]">
                Usage: <code className="text-[#82AAFF] font-bold">project &lt;name&gt;</code> or <code className="text-[#82AAFF] font-bold">open &lt;name&gt;</code> (e.g. project cfss, open cpw).
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#45453F] gap-2">
              <div>
                <span className="text-[10px] text-[#A6A397] uppercase tracking-widest block">{project.category}</span>
                <h3 className="text-base font-bold text-[#F0EEE7]">{project.title}</h3>
                <p className="text-[#A6A397] text-[11px]">{project.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={project.status} />
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-0.5 rounded bg-[#7EC28D]/15 text-[#7EC28D] border border-[#7EC28D]/30 text-[10px] font-bold"
                  >
                    LIVE ↗
                  </a>
                )}
              </div>
            </div>

            {/* Overview / Problem */}
            <div className="space-y-2">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#A6A397] block">Overview</span>
                <p className="text-[#F0EEE7] leading-relaxed text-[12px]">{project.description}</p>
              </div>
              {project.problem && (
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#A6A397] block">Problem Statement</span>
                  <p className="text-[#A6A397] leading-relaxed text-[12px]">{project.problem}</p>
                </div>
              )}
            </div>

            {/* System Architecture */}
            {project.system && (
              <div className="p-3 rounded bg-[#292A27] border border-[#45453F]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#A6A397] block mb-1">Architecture & System</span>
                <p className="text-[#F0EEE7] leading-relaxed text-[12px]">{project.system}</p>
              </div>
            )}

            {/* Capabilities */}
            {project.capabilities && project.capabilities.length > 0 && (
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#A6A397] block mb-1.5">Key Capabilities</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                  {project.capabilities.map((cap, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[#A6A397]">
                      <span className="text-[#82AAFF] shrink-0">•</span>
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech stack */}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#A6A397] block mb-1.5">Verified Technologies</span>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded bg-[#32332F] border border-[#45453F] text-[10px] font-medium text-[#F0EEE7]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 border-t border-[#45453F] flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => ctx.navigate(project.ctaLink)}
                className="px-3 py-1 rounded bg-[#82AAFF] text-[#1c1d1a] font-bold text-[11px] hover:bg-[#A8C7FA] cursor-pointer transition-colors"
              >
                Open Full Case Study Page →
              </button>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded bg-[#32332F] text-[#F0EEE7] border border-[#45453F] font-bold text-[11px] hover:bg-[#3E403B] transition-colors"
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
    description: 'Navigate directly to an allowlisted project case study page or section.',
    usage: 'open <cfss|mastery|cpw|agrichem|cv>',
    examples: ['open cfss', 'open cpw', 'open mastery', 'open agrichem', 'open cv'],
    execute: (args, ctx) => {
      if (args.length === 0) {
        return {
          error: "Usage: open <cfss|mastery|cpw|agrichem|cv>. Run 'projects' to list all.",
        };
      }
      const rawTarget = args[0].toLowerCase().trim();

      // Check section shortcuts
      const sectionMap: Record<string, string> = {
        cv: '/cv',
        about: '/#about',
        work: '/#work',
        projects: '/#work',
        skills: '/#skills',
        timeline: '/#timeline',
        research: '/#research',
        contact: '/#contact',
      };

      if (sectionMap[rawTarget]) {
        const route = sectionMap[rawTarget];
        if (!isApprovedInternalRoute(route)) {
          return { error: `Navigation blocked: '${route}' is not on the route allowlist.` };
        }
        setTimeout(() => ctx.navigate(route), 200);
        return {
          output: <SuccessMsg>Navigating to {rawTarget.toUpperCase()} ({route})...</SuccessMsg>,
        };
      }

      const targetId = resolveProjectId(rawTarget);
      if (!targetId) {
        return {
          error: `Unknown project or section: '${args[0]}'. Available options: cfss, mastery, cpw, agrichem, cv.`,
        };
      }
      const project = ctx.projects.find((p) => p.id === targetId);
      if (!project) {
        return { error: `Project '${targetId}' not found.` };
      }
      if (!isApprovedInternalRoute(project.ctaLink)) {
        return { error: `Navigation blocked: Destination '${project.ctaLink}' is not allowlisted.` };
      }
      setTimeout(() => ctx.navigate(project.ctaLink), 200);
      return {
        output: <SuccessMsg>Navigating to {project.title} case study ({project.ctaLink})...</SuccessMsg>,
      };
    },
    getSubcommands: () => ['cfss', 'mastery', 'cpw', 'agrichem', 'cv', 'about', 'skills', 'contact'],
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
