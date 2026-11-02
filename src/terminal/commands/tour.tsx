import React from 'react';
import { Command, CommandContext } from '../types';
import { InfoHeader, StatusBadge } from '../components/TerminalUI';

interface TourStepData {
  step: number;
  title: string;
  category: string;
  summary: string;
  details: string[];
  suggestedCmd?: string;
}

const TOUR_STEPS: TourStepData[] = [
  {
    step: 1,
    title: 'Identity & Engineering Background',
    category: 'OVERVIEW',
    summary: 'Joshua Winyelsum is a Computer Science student at the University for Development Studies and a software engineer based in Tamale, Ghana.',
    details: [
      'Focusing on backend systems, relational data integrity, offline-first architectures, and verifiable data pipelines.',
      'Believes in evidence-driven software engineering: claims must be supported by passing test suites, working deployments, and production deliverables.',
      'Google Cybersecurity Professional Certificate recipient (94.52% overall grade).',
    ],
    suggestedCmd: 'cat ABOUT.md',
  },
  {
    step: 2,
    title: 'Core Technical Focus & Architectural Pillars',
    category: 'SPECIALIZATION',
    summary: 'Deep investment in systems that operate correctly under challenging real-world constraints.',
    details: [
      'Relational Schema Design: Strict foreign key constraints, composite indexing, and migration discipline in PostgreSQL & MySQL.',
      'Offline-First Local Synchronization: IndexedDB / Dexie client queues resilient to intermittent rural connectivity.',
      'Deterministic Algorithms: Graph algorithms (DAG cycle detection via DFS) and spaced repetition scheduling (SuperMemo SM-2).',
      'Defensive Engineering: Layered validation with Zod / Pydantic, connection budgeting, and role isolation.',
    ],
    suggestedCmd: 'stack',
  },
  {
    step: 3,
    title: 'Production Platform: Coach Prosper’s World',
    category: 'LIVE PRODUCTION APPLICATION',
    summary: 'A full-stack production platform serving 100+ active members for an international youth mentorship organization.',
    details: [
      'Live in production at coachprospersworld.org with automated payment webhooks and SMS broadcast notifications.',
      'Dual-Tier Storage: Vercel Blob public asset storage cleanly isolated from private applicant documentation vaults.',
      'Webhook Security: Cryptographically verified Paystack donation webhooks (HMAC-SHA512) with idempotent balance updates.',
      'Full administrative audit logging and role-based access control.',
    ],
    suggestedCmd: 'inspect cpw',
  },
  {
    step: 4,
    title: 'Systems & Offline-First: CFSS',
    category: 'INSTITUTIONAL FIELD PLATFORM',
    summary: 'Community Field Survey System: an offline-first survey and GIS platform engineered for university field operations.',
    details: [
      'Solves the problem of field researchers losing data in disconnected rural and semi-urban communities.',
      'IndexedDB / Dexie client persistence with an intelligent reconciliation engine resolving local drafts against the server.',
      'Geospatial Validation: Leaflet GIS map interface with GPS accuracy radius verification and coordinate bounding.',
      '50+ automated backend integration tests and Playwright recovery suites.',
    ],
    suggestedCmd: 'inspect cfss',
  },
  {
    step: 5,
    title: 'Algorithms & Data Systems: MasteryOS',
    category: 'LEARNING ENGINE ARCHITECTURE',
    summary: 'An active recall and spaced repetition learning workspace engineered around genuine retrieval effort and prerequisite DAG modeling.',
    details: [
      'SuperMemo SM-2 spaced repetition algorithm calculating retention intervals deterministically.',
      'Prerequisite Dependency Graph: Directed Acyclic Graph (DAG) with Depth-First Search cycle detection preventing circular prerequisite deadlocks.',
      'Active Retrieval Enforcement: Reference material is strictly hidden during recall to prevent passive recognition illusions.',
      '18 verified unit tests covering interval boundary calculations and graph cycle verification.',
    ],
    suggestedCmd: 'inspect mastery',
  },
  {
    step: 6,
    title: 'Data Systems Research: AgriChem Pipeline',
    category: 'DATA ENGINEERING & RESEARCH',
    summary: 'An evidence-backed data research pipeline investigating pesticide residues and regulatory records in Ghana’s cocoa agricultural sector.',
    details: [
      'Pesticide records in Ghana were fragmented across legacy PDFs, regulatory reports, and theses with OCR anomalies and contradictions.',
      'Built a reproducible Python data pipeline with SHA-256 checksum locks on raw sources and coordinate-based PDF table extractors.',
      'Curated 346 machine-verified evidence quotes cross-checked against exact source pages.',
      'Canonical long-format dataset (708 observations) with explicit missing-value semantics.',
    ],
    suggestedCmd: 'inspect agrichem',
  },
  {
    step: 7,
    title: 'Engineering Philosophy & Architecture Principles',
    category: 'METHODOLOGY',
    summary: 'Core engineering heuristics that guide Joshua’s system design and code.',
    details: [
      '1. Correctness Before Optimization: Verify invariants and transactional boundaries before premature tuning.',
      '2. Explicit Failure Modes: Prefer descriptive typed domain errors over silent fallbacks or swallowed exceptions.',
      '3. Verifiable Claims: Never claim production readiness, user counts, or benchmarks without reproducible artifacts.',
      '4. Defense in Depth: Secure systems at input parsing, domain validation, transport, and storage layers.',
    ],
    suggestedCmd: 'cat CAREER.md',
  },
  {
    step: 8,
    title: 'Credentials, CV & Contact',
    category: 'NEXT STEPS',
    summary: 'Connect with Joshua or review his comprehensive editorial CV.',
    details: [
      'BSc in Computer Science (UDS, 2022 – 2026 expected) | Google Cybersecurity Professional Certificate (94.52%).',
      'Editorial CV: Available on the website at /cv or exportable as an A4 PDF.',
      'GitHub: github.com/joshuawinyelsum | LinkedIn: linkedin.com/in/joshuawinyelsum',
      'Email: joshuawinyelsum@gmail.com | Phone: +233 54 921 6347',
    ],
    suggestedCmd: 'cv',
  },
];

export const tourCommand: Command = {
  name: 'tour',
  category: 'Recruiter',
  description: 'Launch an interactive 8-step guided engineering tour.',
  usage: 'tour [next | prev | jump <1-8> | exit]',
  examples: ['tour', 'tour next', 'tour prev', 'tour jump 4', 'tour exit'],
  execute: (args, ctx: CommandContext) => {
    let currentStep = ctx.tourStep > 0 ? ctx.tourStep : 1;

    if (args.length > 0) {
      const action = args[0].toLowerCase();
      if (action === 'next' || action === 'n') {
        currentStep = Math.min(TOUR_STEPS.length, currentStep + 1);
      } else if (action === 'prev' || action === 'p' || action === 'back') {
        currentStep = Math.max(1, currentStep - 1);
      } else if (action === 'exit' || action === 'quit' || action === 'q') {
        ctx.setTourStep(0);
        return {
          output: (
            <div className="p-3 rounded bg-[#292A27] border border-[#45453F] font-mono text-xs text-[#A6A397]">
              Guided tour exited. Run <code className="text-[#82AAFF] font-bold">tour</code> anytime to resume.
            </div>
          ),
        };
      } else if (action === 'jump' && args[1]) {
        const jumpNum = parseInt(args[1], 10);
        if (!isNaN(jumpNum) && jumpNum >= 1 && jumpNum <= TOUR_STEPS.length) {
          currentStep = jumpNum;
        } else {
          return { error: `Invalid step: '${args[1]}'. Must be between 1 and ${TOUR_STEPS.length}.` };
        }
      } else {
        const num = parseInt(action, 10);
        if (!isNaN(num) && num >= 1 && num <= TOUR_STEPS.length) {
          currentStep = num;
        }
      }
    }

    ctx.setTourStep(currentStep);
    const data = TOUR_STEPS[currentStep - 1];

    return {
      output: (
        <div className="p-3.5 sm:p-4 rounded-xl bg-[#292A27] border border-[#45453F] font-mono text-xs space-y-3">
          {/* Header & Step Tracker */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#45453F] gap-2">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#82AAFF]">
                {data.category}
              </div>
              <div className="text-sm font-bold text-[#F0EEE7]">
                Step {data.step} of {TOUR_STEPS.length}: {data.title}
              </div>
            </div>
            {/* Progress indicator pills */}
            <div className="flex items-center gap-0.5">
              {TOUR_STEPS.map((s) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => ctx.runCommand(`tour jump ${s.step}`)}
                  className="p-1 min-w-[24px] min-h-[24px] flex items-center justify-center cursor-pointer transition-colors"
                  title={`Jump to step ${s.step}: ${s.title}`}
                >
                  <span
                    className={`w-4 h-1.5 rounded-full block ${
                      s.step === data.step
                        ? 'bg-[#82AAFF]'
                        : s.step < data.step
                        ? 'bg-[#7EC28D]'
                        : 'bg-[#45453F] hover:bg-[#7A786E]'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <p className="text-[#F0EEE7] leading-relaxed font-semibold">
            {data.summary}
          </p>

          {/* Bulleted details */}
          <ul className="space-y-1.5 pl-3 border-l-2 border-[#45453F] text-[#A6A397] text-[11.5px] leading-relaxed">
            {data.details.map((d, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-[#7EC28D] select-none font-bold">-</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>

          {/* Suggested exploratory command */}
          {data.suggestedCmd && (
            <div className="flex items-center gap-2 pt-1 text-[11px] text-[#A6A397]">
              <span>Related inspection command:</span>
              <button
                type="button"
                onClick={() => ctx.runCommand(data.suggestedCmd!)}
                className="px-2 py-0.5 rounded bg-[#32332F] border border-[#45453F] text-[#82AAFF] hover:bg-[#3E403B] font-semibold cursor-pointer transition-colors"
              >
                $ {data.suggestedCmd}
              </button>
            </div>
          )}

          {/* Interactive Navigation Action Bar */}
          <div className="flex flex-wrap items-center justify-between pt-2 border-t border-[#45453F] gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentStep === 1}
                onClick={() => ctx.runCommand('tour prev')}
                className={`px-3 py-1.5 min-h-[34px] flex items-center rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  currentStep === 1
                    ? 'opacity-40 cursor-not-allowed text-[#7A786E]'
                    : 'bg-[#32332F] text-[#F0EEE7] hover:bg-[#3E403B] border border-[#45453F]'
                }`}
              >
                Previous
              </button>
              <button
                type="button"
                disabled={currentStep === TOUR_STEPS.length}
                onClick={() => ctx.runCommand('tour next')}
                className={`px-3 py-1.5 min-h-[34px] flex items-center rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  currentStep === TOUR_STEPS.length
                    ? 'opacity-40 cursor-not-allowed text-[#7A786E]'
                    : 'bg-[#82AAFF] text-[#1E1E1E] hover:bg-[#99BBFF]'
                }`}
              >
                Next
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#7A786E]">or type 'tour next'</span>
              <button
                type="button"
                onClick={() => ctx.runCommand('tour exit')}
                className="px-2 py-0.5 rounded text-[10px] text-[#A6A397] hover:text-[#F0EEE7] hover:bg-[#32332F] transition-colors cursor-pointer"
              >
                Exit Tour
              </button>
            </div>
          </div>
        </div>
      ),
    };
  },
  getSubcommands: () => ['next', 'prev', 'exit', 'jump 1', 'jump 2', 'jump 3', 'jump 4', 'jump 5', 'jump 6', 'jump 7', 'jump 8'],
};
