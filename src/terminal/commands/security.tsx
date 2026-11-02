import React from 'react';
import { Command } from '../types';
import { InfoHeader } from '../components/TerminalUI';

interface SecurityControl {
  control: string;
  status: 'ACTIVE' | 'ENFORCED' | 'BLOCKED' | 'READ-ONLY' | 'DISABLED';
  mechanism: string;
  rationale: string;
}

const CONTROLS: SecurityControl[] = [
  {
    control: 'Simulation Execution Mode',
    status: 'ACTIVE',
    mechanism: '100% in-memory closed application interpreter',
    rationale: 'Isolates visitor exploration from host system resources and processes.',
  },
  {
    control: 'Operating System Shell Execution',
    status: 'DISABLED',
    mechanism: 'No eval(), Function(), exec(), or child_process',
    rationale: 'OWASP Command Injection Prevention: prevents arbitrary command execution.',
  },
  {
    control: 'Host Filesystem Isolation',
    status: 'BLOCKED',
    mechanism: 'Immutable in-memory tree; path traversal protection',
    rationale: 'Guarantees visitor cannot access actual server disk or traversal paths (../../.env).',
  },
  {
    control: 'Environment Variables & Secrets',
    status: 'BLOCKED',
    mechanism: 'process.env and import.meta.env isolated from terminal context',
    rationale: 'Prevents leakage of API keys, tokens, or private infrastructure configs.',
  },
  {
    control: 'Arbitrary Outbound Network Requests',
    status: 'DISABLED',
    mechanism: 'No terminal-triggered fetch(), curl, or socket capabilities',
    rationale: 'Mitigates Server-Side Request Forgery (SSRF) and external network probing.',
  },
  {
    control: 'Virtual Filesystem Mutation',
    status: 'READ-ONLY',
    mechanism: 'Object.freeze() applied to all virtual directory structures',
    rationale: 'Ensures terminal state cannot be permanently altered across visitor sessions.',
  },
  {
    control: 'Command Interpreter Allowlist',
    status: 'ENFORCED',
    mechanism: 'Strict allowlist lookup with independent argument validators',
    rationale: 'Reject shell operators (&&, ;, |, >, <) and unapproved system utilities.',
  },
  {
    control: 'Safe React Output Rendering',
    status: 'ENFORCED',
    mechanism: 'Typed React components; zero dangerouslySetInnerHTML usage',
    rationale: 'OWASP Cross-Site Scripting (XSS) Prevention: all visitor input rendered as text.',
  },
  {
    control: 'Navigation & Redirect Boundaries',
    status: 'ENFORCED',
    mechanism: 'Strict internal route allowlist; trusted social URLs only',
    rationale: 'Prevents open redirect vulnerabilities and protocol scheme injection (javascript:).',
  },
];

export const securityCommand: Command = {
  name: 'security',
  aliases: ['audit', 'policy', 'owasp'],
  category: 'Recruiter',
  description: 'Display terminal security architecture, isolation controls, and OWASP compliance.',
  execute: () => {
    return {
      output: (
        <div className="p-3.5 sm:p-5 rounded-xl bg-[#292A27] border border-[#45453F] font-mono text-xs space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-[#45453F] gap-2">
            <div>
              <div className="text-[10px] uppercase font-bold text-[#7EC28D] tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#7EC28D] animate-pulse" />
                SECURITY ARCHITECTURE & BOUNDARY AUDIT
              </div>
              <div className="text-sm font-bold text-[#F0EEE7]">
                Simulation Controls & OWASP Defense-in-Depth
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#20211F] text-[#82AAFF] border border-[#45453F] font-bold">
              OWASP ALIGNED
            </span>
          </div>

          <p className="text-[#A6A397] text-[11.5px] leading-relaxed">
            This terminal is designed to deliver a realistic Linux-inspired developer workstation experience for recruiters and engineering peers, while enforcing absolute isolation from underlying host infrastructure.
          </p>

          {/* Control Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-[#45453F] text-[#A6A397] uppercase text-[10px] tracking-wider">
                  <th className="py-1.5 pr-3 font-semibold">Security Boundary</th>
                  <th className="py-1.5 px-3 font-semibold">State</th>
                  <th className="py-1.5 px-3 font-semibold">Enforcement Mechanism</th>
                  <th className="py-1.5 pl-3 font-semibold hidden md:table-cell">Security Objective</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3A3A35] text-[#F0EEE7]">
                {CONTROLS.map((c, i) => (
                  <tr key={i} className="hover:bg-[#20211F]/50 transition-colors">
                    <td className="py-2 pr-3 font-semibold text-[#F0EEE7] whitespace-nowrap">
                      {c.control}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-[#7EC28D]/15 text-[#7EC28D] border border-[#7EC28D]/30">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-[#A6A397] font-mono text-[10.5px]">
                      {c.mechanism}
                    </td>
                    <td className="py-2 pl-3 text-[#7A786E] text-[10.5px] hidden md:table-cell">
                      {c.rationale}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Engineering Philosophy Notice */}
          <div className="p-3 rounded bg-[#20211F] border border-[#45453F] space-y-1 text-[11px]">
            <div className="font-bold text-[#82AAFF]">
              Security by Design Principle:
            </div>
            <p className="text-[#A6A397] leading-relaxed">
              We never claim a system is invulnerable. Rather, by rejecting unnecessary privileges upfront (Principle of Least Privilege) and constructing an allowlisted interpreter rather than an open shell, the attack surface is reduced to zero real OS execution pathways.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between pt-1 border-t border-[#45453F] text-[10px] text-[#7A786E]">
            <span>References: OWASP Injection Prevention Cheat Sheet & XSS Prevention Cheat Sheet</span>
            <span>Document: /docs/TERMINAL_SECURITY.md</span>
          </div>
        </div>
      ),
    };
  },
};
